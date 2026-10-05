/**
 * 栈序AI - 百度千帆 AI 配置模板
 *
 * 用法：
 * 1. 复制本文件为 src/config/ai.config.local.js
 * 2. 填入你的真实 API Key 与模型名
 * 3. ai.config.local.js 已在 .gitignore 中忽略，不会上传仓库
 */
module.exports = {
  // 百度千帆 OpenAI 兼容接口的 API Key（控制台「应用接入」获取）
  apiKey: 'YOUR_QIANFAN_API_KEY',
  // 推荐模型：ernie-3.5-8k / ernie-4.0-8k / ernie-speed-8k 等
  model: 'ernie-3.5-8k'
}