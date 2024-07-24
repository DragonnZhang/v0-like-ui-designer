import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from 'langchain/document'
import chalk from 'chalk'

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
  const systemTemplate = `
Based on the HTML structure and task instructions provided by the user, generate the following object structure:
"data": {{
  "target": "", 
  "parameters": [], 
  "returnValue": [], 
  "code": "" 
}}
where:
target is the code to get the DOM element to be operated on;
parameters are the parameters required by code;
returnValue is the return value of the generated function;
code is the generated function code, in the form of "function f(para1, para2, ...) {{ xxx }}", where the function parameters correspond to parameters.

Example 1:
If the user's task is "When the login button is clicked, send a request to login interface with username and password parameters", it should return the following JSON string:
"data": {{ 
  "target": "document.getElementById('idx')", 
  "parameters": ['target', 'This should be the actual backend_url such as http://URL_ADDRESS:URL_PORT/login'], 
  "returnValue": ['response'], 
  "code": "function f(target, url) {{ target.addEventListener('click', async () => {{ const username = document.getElementById('id_username').value; const password = document.getElementById('id_password').value; const response = await fetch(...); return response }}) }}"
}}
where idx in target is the id of the login button element; parameters include target and url because the user's task is to execute the corresponding logic when the login button is clicked, so the function needs to receive target as a parameter, and url is required to send request. I have omitted the url because its value depends on the actual situation, you need to fill in the value according to the actual situation(which may occur in context or task); id_username and id_password are the ids of the username and password input elements respectively; I have omitted some of the fetch code in the example code, in actual situations it needs to be filled in.

Example 2:
If the user's task is "When the 'Forgot your password?' link is clicked, navigate to the reset page", it should return the following JSON string:
"data": {{
  "target": "document.getElementById('idx')",
  "parameters": ['target', 'reset'], 
  "returnValue": [], 
  "code": "function f(target, url) {{ // The code logic is to set the href of target to url }}"
}} 
where idx in target is the id of the link element; parameters includes target and the redirect URL 'reset', because the user's task is to execute the redirect logic when the link is clicked, so the function needs to receive target and the redirect URL as parameters; I have omitted some of the code in the example code, in actual situations it needs to be filled in.

Pay Attention:
1. Please return this object structure as a JSON string, without using markdown syntax like \`\`\`json.
2. When using dom api to select elements, make sure the corresponding elements exist, or the code will throw an error.
3. No comments allowed in the code because that will cause errors, implement all the codes, never use TODO.
4. Use the following pieces of context to help you generate the object structure. The context may contain interface information:
{context}
`

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
