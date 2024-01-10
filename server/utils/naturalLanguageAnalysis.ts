import { OpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'

const config = useRuntimeConfig()

const llm = new OpenAI({
  temperature: 0,
  openAIApiKey: config.openaiApiKey
})

export const generatePage = async (userPrompt: string) => {
  const promptTemplate = PromptTemplate.fromTemplate(
    `
    Generate html which satifies user input.

    userInput: """
    {userPrompt}
    """
    `
  )

  const chain = promptTemplate.pipe(llm)

  const llmResult = await chain.invoke({
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

  const chain = promptTemplate.pipe(llm)

  const llmResult = await chain.invoke({
    domString: dom,
    task
  })

  return llmResult
}
