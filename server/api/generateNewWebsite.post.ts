import { generatePage } from '../utils/naturalLanguageAnalysis'

export default defineEventHandler(async (event) => {
  const { userPrompt } = await readBody(event)

  console.log(`Processing ${userPrompt}`)
  try {
    const stream = await generatePage(userPrompt)
    console.log('response', stream)

    return sendStream(event, stream)
  } catch (err) {
    console.log(err)
    return null
  }
})
