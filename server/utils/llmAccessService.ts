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
        temperature: 0,
        openAIApiKey: config.openaiApiKey,
        maxTokens: 2000,
        streaming: config.public.streaming
      })
    } else if (model === 'qwen') {
      return new ChatAlibabaTongyi({
        modelName: 'qwen-plus',
        temperature: 0,
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
        temperature: 0,
        apiKey: config.googleApiKey,
        maxOutputTokens: 2048
      })
    } else {
      throw new Error(`Model ${model} is not supported.`)
    }
  }
}

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
