import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'

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
  // 原来的系统提示词，即根据自然语言直接生成代码的提示词
  // const systemTemplate = `
  // Generate JavaScript code to execute html relevant task.
  // You should always use querySelectorAll rather than querySelector, such as querySelector('#id1, #id2') to select elements.
  // Then you do something to elements selected, such as add style, add event listener or appendChild.
  // If code executes adding element task, code should use appendChild rather than innerHTML.
  // Only generate code, do not use markdown syntax like \`\`\`javascript.
  // Take a deep breath.
  // `

  // 新的系统提示词
  const systemTemplate = `
  Based on the HTML structure and task instructions provided by the user, generate the following object structure:
  "data":{{
    "target": "",
    "parameters": [],
    "returnValue": [],
    "code": ""
  }}
  where target is the code to get the DOM element to be operated on, parameters are the required parameters, returnValue is the return value of the generated function, and code is the generated function code.

  For example:
  For a page navigation/popup task, target should be the code to get the corresponding DOM element, parameters may include the navigation URL, and returnValue is empty.
  For a page scroll task, target should be the code to get the corresponding DOM element, parameters may include the scroll destination, and returnValue is empty.
  For a task to send a request to the backend, target should be the code to get the corresponding DOM element, parameters may include the backend URL, and returnValue is the backend response.
  For a task to display data, target should be the code to get the corresponding DOM element (such as the display location), parameters may include the data list to be displayed, and returnValue is empty.

  Please return this object as a JSON string. Do not use markdown syntax like \`\`\`json.
  `

  // 用户提示词
  const humanTemplate = '{dom}、{task}'

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  const parser = new StringOutputParser()

  const chain = chatPrompt.pipe(model).pipe(parser)

  const llmResult = config.public.streaming
    ? await chain.stream({
        dom,
        task
      })
    : await chain.invoke({
        dom,
        task
      })

  return llmResult
}
