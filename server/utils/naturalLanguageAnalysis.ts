import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import chalk from 'chalk'
import * as fs from 'node:fs'

const config = useRuntimeConfig()

const model = getModelInstance()

// 根据自然语言生成界面的提示词
export const generateHTMLFromNaturalLanguage = async (userPrompt: string) => {
  const systemTemplate = `
  You are a web ui designer. Create a web page based on user input and is styled using Tailwind CSS.
  The design should be modern and minimalistic, providing a user-friendly interface.

  Here are something you need to pay attention:
  1.Analysis of User Input: Begin by deciphering the business logic conveyed through user input. Then, design the page layout and features based on this logic.
  2.Image Handling: For image elements, set the src attribute to '/placeholder.svg'. This ensures a consistent placeholder image is used where necessary.
  3.SVG Integration: If an SVG is used, it should be contextually appropriate and serve as an icon reflective of its function. Ensure to embed the SVG directly into the DOM.
  4.Design Aesthetic: Embrace a contemporary and minimalist design style. This should be reflected in the choice of colors, typography, spacing, and overall layout.
  5.Functionality and Interactivity: The core purpose of the page is to display user data effectively. Incorporate basic interactive elements like buttons or links to enhance user engagement.
  
  Note:Please generate the HTML code directly without using Markdown code block format(do not start with \`\`\`html or end with \`\`\`).
  `
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
  const systemTemplate = fs.readFileSync('server/utils/prompts/chi2025.txt', 'utf-8')

  // 用户提示词
  const humanTemplate = '{dom}、{task}'

  // 提示词模板
  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  // rag context，暂时只支持使用 gemini
  const loader = new TextLoader('storage/interface.md')
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
