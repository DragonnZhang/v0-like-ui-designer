import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import chalk from 'chalk'
import generateHTMLPrompt from './prompts/generateHTML'
import chi2025Prompt from './prompts/chi2025'
import { Document } from 'langchain/document'
import interfaceInfo from './storage/interface'
import routeInfo from './storage/route'

const config = useRuntimeConfig()

const model = getModelInstance()

// 根据自然语言生成界面的提示词
export const generateHTMLFromNaturalLanguage = async (userPrompt: string) => {
  const systemTemplate = generateHTMLPrompt

  const humanTemplate = '{userPrompt}'

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  const parser = new StringOutputParser()

  const chain = chatPrompt.pipe(model).pipe(parser)

  const llmResult = config.public.streaming
    ? await chain.stream({
        userPrompt
      })
    : await chain.invoke({
        userPrompt
      })

  return llmResult
}

// CHI 2025 论文的提示词
export const generateCode = async (dom: string, task: string) => {
  // 系统提示词
  const systemTemplate = chi2025Prompt

  // 用户提示词
  const humanTemplate = '{dom}、{task}'

  // 提示词模板
  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  // rag context，暂时使用谷歌提供的嵌入
  const docs = [
    new Document({
      pageContent: interfaceInfo
    }),
    new Document({
      pageContent: routeInfo
    })
  ]

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })
  const splits = await textSplitter.splitDocuments(docs)
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    new GoogleGenerativeAIEmbeddings({
      apiKey: config.googleApiKey,
      modelName: 'embedding-001'
    })
  )
  const retriever = vectorStore.asRetriever()
  const context = await retriever.invoke(task)

  console.log(`${chalk.yellow(`${context.length} related context in total:`)}`)
  for (let i = 0; i < context.length; i++) {
    console.log(`${chalk.blue(`Context:${i}`)}\n${context[i].pageContent}`)
  }

  // 直接使用 context 嵌入效果不好，改为使用 contextContent
  const contextContent = context.map((item) => item.pageContent).join('\n')

  // parser
  const parser = new StringOutputParser()

  const chain = chatPrompt.pipe(model).pipe(parser)

  const llmResult = config.public.streaming
    ? await chain.stream({
        context: contextContent,
        dom,
        task
      })
    : await chain.invoke({
        context: contextContent,
        dom,
        task
      })

  return llmResult
}
