import { ChatOpenAI } from '@langchain/openai'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { ChatBaiduWenxin } from '@langchain/community/chat_models/baiduwenxin'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { type BaseChatModel } from '@langchain/core/language_models/chat_models'
import { type modelType } from './type'

const config = useRuntimeConfig()

const getModelStrategy: {
  [key in modelType]: () => BaseChatModel
} = {
  openai: () =>
    new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: config.temperature,
      openAIApiKey: config.openaiApiKey,
      maxTokens: config.maxTokens,
      streaming: config.public.streaming
    }),
  qwen: () =>
    new ChatAlibabaTongyi({
      modelName: 'qwen-plus',
      temperature: config.temperature,
      alibabaApiKey: config.qwenApiKey,
      streaming: config.public.streaming
    }),
  wenxin: () =>
    new ChatBaiduWenxin({
      modelName: 'ERNIE-Bot-turbo',
      baiduApiKey: config.baiduApiKey,
      baiduSecretKey: config.baiduSecretKey
    }),
  gemini: () =>
    new ChatGoogleGenerativeAI({
      modelName: 'gemini-pro',
      temperature: config.temperature,
      apiKey: config.googleApiKey,
      maxOutputTokens: config.maxTokens
    })
}

// Model factory
const getModel = (function () {
  let model: BaseChatModel

  return (modelName: modelType) => {
    if (!model) {
      if (modelName in getModelStrategy) {
        model = getModelStrategy[modelName]()
      } else {
        throw new Error(`Model ${model} is not supported.`)
      }
    }
    return model
  }
})()

export function getModelInstance() {
  return getModel(config.model as modelType)
}
