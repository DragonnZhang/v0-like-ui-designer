import { ChatOpenAI } from '@langchain/openai'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { ChatBaiduWenxin } from '@langchain/community/chat_models/baiduwenxin'

const config = useRuntimeConfig()

const openAIModel = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: config.openaiApiKey,
  maxTokens: 500,
  streaming: config.streaming
})

const qwen = new ChatAlibabaTongyi({
  modelName: 'qwen-max',
  temperature: 0,
  alibabaApiKey: config.qwenApiKey,
  streaming: config.streaming
})

const wenxin = new ChatBaiduWenxin({
  modelName: 'ERNIE-Bot-turbo',
  baiduApiKey: config.baiduApiKey,
  baiduSecretKey: config.baiduSecretKey
})

export function getModelInstance() {
  return qwen
}
