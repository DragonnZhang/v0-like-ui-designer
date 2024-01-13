import { generateHTMLFromNaturalLanguage } from '../utils/naturalLanguageAnalysis'

export default defineEventHandler(async (event) => {
  const { userPrompt } = await readBody(event)

  console.log(`Processing prompt: ${userPrompt}`)
  try {
    const htmlResponse = await generateHTMLFromNaturalLanguage(userPrompt)
    console.log('Response html', htmlResponse)

    return typeof htmlResponse === 'string'
      ? htmlResponse
      : sendStream(event, htmlResponse)
  } catch (err) {
    console.error(err)
    return null
  }
})
