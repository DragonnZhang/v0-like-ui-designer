import { generatePage } from '../utils/naturalLanguageAnalysis'

export default defineEventHandler(async (event) => {
  const { userPrompt } = await readBody(event)

  try {
    const res = await generatePage(userPrompt)
    return res
  } catch (err) {
    console.log(err)
    return null
  }
})
