import { generateCode } from '../utils/naturalLanguageAnalysis'
import { StreamingTextResponse } from 'ai'
import chalk from 'chalk'

export const runtime = 'edge'

export default defineEventHandler(async (event) => {
  const { domString, task } = await readBody(event)

  console.log(`${chalk.blue('Processing dom string:')}\n${chalk.green(domString)}`)
  console.log(`${chalk.blue('Processing prompt:')} ${task}`)
  try {
    const htmlResponse = await generateCode(domString, task)
    console.log(`${chalk.blue('Response html:')}\n${htmlResponse}`)

    return typeof htmlResponse === 'string' ? htmlResponse : new StreamingTextResponse(htmlResponse)
  } catch (err) {
    console.error(chalk.red(err))
    return ''
  }
})
