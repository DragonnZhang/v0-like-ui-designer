import { ChatOpenAI } from '@langchain/openai'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { ChatBaiduWenxin } from '@langchain/community/chat_models/baiduwenxin'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { modelType } from '~/utils/type'

const config = useRuntimeConfig()

class Model {
  constructor(model: modelType) {
    if (model === 'openai') {
      return new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: config.temperature,
        openAIApiKey: config.openaiApiKey,
        maxTokens: config.maxTokens,
        streaming: config.public.streaming
      })
    } else if (model === 'qwen') {
      return new ChatAlibabaTongyi({
        modelName: 'qwen-plus',
        temperature: config.temperature,
        alibabaApiKey: config.qwenApiKey,
        streaming: config.public.streaming
      })
    } else if (model === 'wenxin') {
      return new ChatBaiduWenxin({
        modelName: 'ERNIE-Bot-turbo',
        baiduApiKey: config.baiduApiKey,
        baiduSecretKey: config.baiduSecretKey
      })
    } else if (model === 'gemini') {
      return new ChatGoogleGenerativeAI({
        modelName: 'gemini-pro',
        temperature: config.temperature,
        apiKey: config.googleApiKey,
        maxOutputTokens: config.maxTokens
      })
    } else {
      throw new Error(`Model ${model} is not supported.`)
    }
  }
}

// Model factory
const getModel = (function () {
  let model: any

  return (modelName: modelType) => {
    if (!model) {
      model = new Model(modelName)
    }
    return model
  }
})()

export function getModelInstance() {
  return getModel(config.model as modelType)
}
