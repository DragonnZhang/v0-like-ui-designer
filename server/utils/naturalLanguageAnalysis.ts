import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import chalk from 'chalk'
import * as fs from 'node:fs'
import * as path from 'node:path'

const config = useRuntimeConfig()

const model = getModelInstance()

// 根据自然语言生成界面的提示词
export const generateHTMLFromNaturalLanguage = async (userPrompt: string) => {
  const systemTemplate = fs.readFileSync('./server/utils/prompts/generateHTML.txt', 'utf-8')

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
  const systemTemplate = fs.readFileSync(path.resolve(__dirname, './prompts/chi2025.txt'), 'utf-8')

  // 用户提示词
  const humanTemplate = '{dom}、{task}'

  // 提示词模板
  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  // rag context，暂时只支持使用 gemini
  const loader = new TextLoader(path.resolve(__dirname, '../../storage/data.md'))
  const docs = await loader.load()

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
