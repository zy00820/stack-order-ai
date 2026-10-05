/**
 * 栈序AI - 百度千帆对话服务
 * 基于 OpenAI 兼容的千帆 v2 对话接口：
 * POST https://qianfan.baidubce.com/v2/chat/completions
 * 鉴权方式：Authorization: Bearer <API Key>
 */
import fetch from '@blueos.network.fetch'

// 百度千帆 OpenAI 兼容接口的 API Key（控制台「应用接入」获取）
// 注意：请将下面的占位符替换为你自己的 API Key，不要提交真实密钥到公开仓库。
// 生产环境建议通过安全后端代理，不要把密钥直接内置到手表应用。
const QIANFAN_API_KEY = 'YOUR_QIANFAN_API_KEY'

const QIANFAN_CHAT_URL = 'https://qianfan.baidubce.com/v2/chat/completions'
// 推荐使用千帆平台支持的基础模型，如 ernie-3.5-8k、ernie-4.0-8k、ernie-speed-8k 等
const DEFAULT_MODEL = 'ernie-3.5-8k'

/**
 * 发起一次对话请求
 * @param {Array} messages 形如 [{ role: 'user', content: '...' }]
 * @param {Object} options 可选参数（temperature 等）
 * @returns {Promise<string>} AI 回复文本
 */
export function chat(messages, options = {}) {
  return new Promise((resolve, reject) => {
    fetch.fetch({
      url: QIANFAN_CHAT_URL,
      method: 'POST',
      data: JSON.stringify({
        model: options.model || DEFAULT_MODEL,
        messages,
        temperature: options.temperature != null ? options.temperature : 0.8,
        stream: false
      }),
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + QIANFAN_API_KEY
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
