import chalk from 'chalk'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  console.log(`${chalk.blue('Processing username:')} ${username}`)
  console.log(`${chalk.blue('Processing password:')} ${password}`)

  if (username !== 'admin' || password !== '123456') {
    return {
      code: 401,
      message: '登录失败，用户名或密码错误'
    }
  }

  return {
    code: 0,
    message: '登录成功'
  }
})
