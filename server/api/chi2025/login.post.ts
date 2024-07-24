import chalk from 'chalk'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  console.log(`${chalk.blue('Processing username:')} ${username}`)
  console.log(`${chalk.blue('Processing password:')} ${password}`)

  return {
    code: 0,
    message: 'Login success'
  }
})
