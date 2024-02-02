import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'

const config = useRuntimeConfig()

const model = getModelInstance()

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

export const generateCode = async (dom: string, task: string) => {
  const promptTemplate = PromptTemplate.fromTemplate(
    `
    Generate JavaScript code to execute html relevant task.
    You should always use querySelectorAll rather than querySelector, such as querySelector('#id1, #id2') to select elements.
    Then you do something to elements selected, such as add style, add event listener or appendChild.
    If code executes adding element task, code should use appendChild rather than innerHTML.
    Only generate code, no comment.
    Take a deep breath.

    task: """
    {task}
    """

    html dom: """
    {domString}
    """
    `
  )

  const chain = promptTemplate.pipe(model)

  const llmResult = await chain.invoke({
    domString: dom,
    task
  })

  return llmResult
}
