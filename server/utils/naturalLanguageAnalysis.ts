import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'
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
  // 新的系统提示词
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
If the user's task is "When the login button is clicked, send a request to http://localhost:3000/login with username and password parameters", it should return the following JSON string:
"data": {{ 
  "target": "document.getElementById('idx')", 
  "parameters": ['target'], 
  "returnValue": ['response'], 
  "code": "function f(target) {{ target.addEventListener('click', async () => {{ const username = document.getElementById('id_username').value; const password = document.getElementById('id_password').value; const response = await fetch(...); return response }}) }}"
}}
where idx in target is the id of the login button element; parameters only includes target because the user's task is to execute the corresponding logic when the login button is clicked, so the function needs to receive target as a parameter; id_username and id_password are the ids of the username and password input elements respectively; I have omitted some of the fetch code in the example code, in actual situations it needs to be filled in.

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
3. No comments allowed in the code because that will cause errors.
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
