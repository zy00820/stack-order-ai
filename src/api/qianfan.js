/**
 * 栈序AI - 百度千帆对话服务
 * 基于 OpenAI 兼容的千帆 v2 对话接口：
 * POST https://qianfan.baidubce.com/v2/chat/completions
 * 鉴权方式：Authorization: Bearer <API Key>
 *
 * 密钥读取优先级：
 * 1. 环境变量 QIANFAN_API_KEY / QIANFAN_MODEL（打包时通过 NODE_ENV 等注入）
 * 2. 本地配置文件 src/config/ai.config.local.js（已被 .gitignore 忽略）
 * 3. 回退到下面的占位符（仅用于开发演示，勿生产使用）
 */
import fetch from '@blueos.network.fetch'

let config = {}
try {
  config = require('./config/ai.config.local.js') || {}
} catch (e) {
  // 本地配置文件不存在时忽略，使用默认占位符
}

const QIANFAN_CHAT_URL = 'https://qianfan.baidubce.com/v2/chat/completions'

// 环境变量 > 本地配置 > 占位符
const getApiKey = () =>
  (typeof process !== 'undefined' && process.env && process.env.QIANFAN_API_KEY) ||
  config.apiKey ||
  'YOUR_QIANFAN_API_KEY'

const getModel = () =>
  (typeof process !== 'undefined' && process.env && process.env.QIANFAN_MODEL) ||
  config.model ||
  'ernie-3.5-8k'

/**
 * 发起一次对话请求
 * @param {Array} messages 形如 [{ role: 'user', content: '...' }]
 * @param {Object} options 可选参数（temperature、model 等）
 * @returns {Promise<string>} AI 回复文本
 */
export function chat(messages, options = {}) {
  return new Promise((resolve, reject) => {
    fetch.fetch({
      url: QIANFAN_CHAT_URL,
      method: 'POST',
      data: JSON.stringify({
        model: options.model || getModel(),
        messages,
        temperature: options.temperature != null ? options.temperature : 0.8,
        stream: false
      }),
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey()
      },
      responseType: 'json',
      timeout: 20000,
      success(res) {
        if (res.code !== 200) {
          reject(new Error('千帆请求失败，HTTP ' + res.code))
          return
        }
        try {
          const body = res.data
          const text = body.choices && body.choices[0] && body.choices[0].message
            ? body.choices[0].message.content
            : (body.result || '')
          if (!text) {
            reject(new Error('千帆返回内容为空'))
            return
          }
          resolve(text)
        } catch (e) {
          reject(new Error('解析千帆响应失败：' + e.message))
        }
      },
      fail(data, code) {
        reject(new Error('网络请求失败：' + data + ' (code=' + code + ')'))
      }
    })
  })
}