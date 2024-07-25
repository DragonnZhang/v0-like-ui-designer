import { generateCode } from '../utils/naturalLanguageAnalysis'
import { StreamingTextResponse } from 'ai'
import chalk from 'chalk'

export default defineEventHandler(async (event) => {
  const { domString, task } = await readBody(event)

  console.log(`${chalk.blue('Processing dom string:')}\n${chalk.green(domString)}`)
  console.log(`${chalk.blue('Processing prompt:')} ${task}`)
  try {
    const response = await generateCode(domString, task)
    console.log(`${chalk.blue('Response data:')}\n${response}`)

    return typeof response === 'string' ? response : new StreamingTextResponse(response)
  } catch (err) {
    console.error(chalk.red(err))
    return ''
  }
})
