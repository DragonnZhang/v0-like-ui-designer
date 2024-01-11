import { generatePage } from '../utils/naturalLanguageAnalysis'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { userPrompt } = await readBody(event)

  console.log(`Processing prompt: ${userPrompt}`)
  try {
    const res = await generatePage(userPrompt)
    console.log('response', res)

    return config.streaming
      ? sendStream(event, res as ReadableStream<string>)
      : res
  } catch (err) {
    console.log(err)
    return null
  }
})
