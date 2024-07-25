import { generateHTMLFromNaturalLanguage } from '../utils/naturalLanguageAnalysis'
import { StreamingTextResponse } from 'ai'
import chalk from 'chalk'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const userPrompt = messages[messages.length - 1].content

  console.log(`${chalk.blue('Processing prompt:')} ${userPrompt}`)
  try {
    const htmlResponse = await generateHTMLFromNaturalLanguage(userPrompt)
    console.log(`${chalk.blue('Response html:')}\n${htmlResponse}`)

    return typeof htmlResponse === 'string' ? htmlResponse : new StreamingTextResponse(htmlResponse)
  } catch (err) {
    console.error(chalk.red(err))
    return err
  }
})
