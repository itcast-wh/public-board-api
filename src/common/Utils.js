/* 通过token获取JWT的payload部分 */
import jwt from 'jsonwebtoken'
import config from '../config'
import { getValue } from '../config/RedisConfig'
import moment from 'moment'
import path from 'path'
import fs from 'fs'

const getJWTPayload = token => {
  // 验证并解析JWT
  return jwt.verify(token.split(' ')[1], config.secret)
}

const checkCode = async ctx => {
  const { body } = ctx.request
  console.log(body.sid)
  let key = null
  if (body.sid != null) {
    key = body.sid
  }
  const redisData = await getValue(key)
  // 使用过后，删除redis
  // delValue(key)
  if (redisData != null) {
    const data = JSON.parse(redisData)
    if (
      moment().isBefore(moment(data.expire)) &&
      body.code.toLowerCase() === data.code.toLowerCase()
    ) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * 读取路径信息
 * @param {string} path 路径
 */
const getStat = path => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(stats)
      }
    })
  })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
const mkdir = dir => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
const dirExists = async dir => {
  const isExists = await getStat(dir)
  // 如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    // 如果该路径存在但是文件，返回false
    return false
  }
  // 如果该路径不存在
  const tempDir = path.parse(dir).dir // 拿到上级路径
  // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  const status = await dirExists(tempDir)
  let mkdirStatus
  if (status) {
    mkdirStatus = await mkdir(dir)
  }
  return mkdirStatus
}

export { checkCode, getJWTPayload, dirExists }
