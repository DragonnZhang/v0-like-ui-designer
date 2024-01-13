import { generateHTMLFromNaturalLanguage } from '../utils/naturalLanguageAnalysis'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { userPrompt } = await readBody(event)

  console.log(`Processing prompt: ${userPrompt}`)
  try {
    const htmlResponse = await generateHTMLFromNaturalLanguage(userPrompt)
    console.log('Response html', htmlResponse)

    return config.public.streaming
      ? sendStream(event, htmlResponse as ReadableStream<string>)
      : htmlResponse
  } catch (err) {
    console.error(err)
    return null
  }
})
