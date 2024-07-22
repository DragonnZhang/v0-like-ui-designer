import { generateHTMLFromNaturalLanguage } from '../utils/naturalLanguageAnalysis'
import { StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const userPrompt = messages[messages.length - 1].content

  console.log(`Processing prompt: ${userPrompt}`)
  try {
    const htmlResponse = await generateHTMLFromNaturalLanguage(userPrompt)
    console.log('Response html', htmlResponse)

    return typeof htmlResponse === 'string' ? htmlResponse : new StreamingTextResponse(htmlResponse)
  } catch (err) {
    console.error(err)
    return null
  }
})
