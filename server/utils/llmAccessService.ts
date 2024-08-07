import { ChatOpenAI } from '@langchain/openai'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { ChatBaiduQianfan } from '@langchain/baidu-qianfan'
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
      maxTokens: config.maxTokens || -1,
      streaming: config.public.streaming
    }),
  qwen: () =>
    new ChatAlibabaTongyi({
      modelName: 'qwen-plus',
      temperature: config.temperature,
      alibabaApiKey: config.qwenApiKey,
      streaming: config.public.streaming
    }),
  baidu: () =>
    new ChatBaiduQianfan({
      modelName: 'ERNIE-Speed-128K',
      temperature: config.temperature,
      qianfanAccessKey: config.baiduApiKey,
      qianfanSecretKey: config.baiduSecretKey,
      streaming: config.public.streaming
    }),
  gemini: () =>
    new ChatGoogleGenerativeAI({
      modelName: 'gemini-1.5-pro',
      temperature: config.temperature,
      apiKey: config.googleApiKey,
      maxOutputTokens: config.maxTokens || undefined,
      streaming: config.public.streaming
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
