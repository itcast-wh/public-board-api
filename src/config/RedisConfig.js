import redis from 'redis'
import { promisifyAll } from 'bluebird'
import config from './index'

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  detect_buffers: true,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 30) {
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 5) {
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  }
}

// const client = redis.createClient(options)
const client = promisifyAll(redis.createClient(options))

client.on('error', err => {
  console.log('Redis Client Error:' + err)
})

const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if (typeof time !== 'undefined') {
    client.set(key, value, 'EX', time)
  } else {
    client.set(key, value)
  }
}

const getValue = key => {
  return client.getAsync(key)
}

const delValue = key => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfully')
    } else {
      console.log('delete redis key error:' + err)
    }
  })
}

/**
 * 返回所有相关reg的keys
 * @param {String} reg 定义一个查询的正则表达式
 */
const getKeys = async function (reg) {
  const result = await client.keysAsync(reg + '*')
  return result
}

const existKey = async function (key) {
  const result = await client.existsAsync(key)
  return result
}

const deleteKey = async function (key) {
  const result = await client.delAsync(key)
  return result
}

export {
  client,
  setValue,
  getValue,
  delValue,
  getKeys,
  existKey,
  deleteKey
}
