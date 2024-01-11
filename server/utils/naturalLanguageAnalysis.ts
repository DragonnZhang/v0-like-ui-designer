import { PromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = getModelInstance()

const config = useRuntimeConfig()

export const generatePage = async (userPrompt: string) => {
  const promptTemplate = PromptTemplate.fromTemplate(
    `
    Generate a web page which satifies user input.
    First, you need to think about what parts the page contains.
    Then, generate html string for each part.
    Then, add style for dom using tailwind css.
    Finally, you should return an HTML string which contains all parts.

    Example:
    ##
    User Input: A landing page for my design portfolio
    Output: 
    <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900"><header class="px-4 lg:px-6 h-16 flex items-center"><a class="flex items-center justify-center" href="#" rel="ugc"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg><span class="sr-only">My Portfolio</span></a><nav class="ml-auto flex gap-4 sm:gap-6"><a class="text-sm font-medium hover:underline underline-offset-4" href="#" rel="ugc">
        Projects
      </a><a class="text-sm font-medium hover:underline underline-offset-4" href="#" rel="ugc">
        Contact
      </a></nav></header><main class="flex-1"><section class="w-full py-20 sm:py-32 md:py-48 lg:py-64 bg-gray-100 dark:bg-gray-800"><div class="container px-4 md:px-6"><div class="flex flex-col items-center text-center space-y-4"><h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Hi, I'm Your Name
          </h1><p class="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
            I'm a UI/UX designer with a passion for creating beautiful and intuitive digital experiences.
          </p></div></div></section><section id="projects" class="w-full py-12 md:py-24 lg:py-32"><div class="container px-4 md:px-6"><h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-12">
          My Projects
        </h2><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><img src="/placeholder.svg" alt="Project 1" class="w-full h-48 object-cover" width="200" height="200" style="aspect-ratio:200/200;object-fit:cover"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Project 1</h3></div><div class="p-6"><p class="text-gray-500 dark:text-gray-400">
                A brief description of Project 1.
              </p></div></div><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><img src="/placeholder.svg" alt="Project 2" class="w-full h-48 object-cover" width="200" height="200" style="aspect-ratio:200/200;object-fit:cover"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Project 2</h3></div><div class="p-6"><p class="text-gray-500 dark:text-gray-400">
                A brief description of Project 2.
              </p></div></div><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><img src="/placeholder.svg" alt="Project 3" class="w-full h-48 object-cover" width="200" height="200" style="aspect-ratio:200/200;object-fit:cover"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Project 3</h3></div><div class="p-6"><p class="text-gray-500 dark:text-gray-400">
                A brief description of Project 3.
              </p></div></div></div></div></section><section id="contact" class="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"><div class="container px-4 md:px-6"><h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-12">
          Contact Me
        </h2><form class="max-w-md mx-auto space-y-4"><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="name" placeholder="Your Name" required=""><input type="email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="email" placeholder="Your Email" required=""><textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="message" placeholder="Your Message" required=""></textarea><button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full" type="submit">Send Message</button></form></div></section></main><footer class="flex items-center justify-center h-16 px-4 lg:px-6 border-t"><p class="text-xs text-gray-500 dark:text-gray-400">
      © Your Name. All rights reserved.
    </p></footer></div>
    ##

    userInput: """
    {userPrompt}
    """
    `
  )

  const chain = promptTemplate.pipe(model)
  const parser = new StringOutputParser()
  const llmResult = config.public.streaming
    ? await chain.pipe(parser).stream({
        userPrompt
      })
    : await chain.pipe(parser).invoke({
        userPrompt
      })

  return llmResult
}

export const generateCode = async (dom: string, task: string) => {
  const promptTemplate = PromptTemplate.fromTemplate(
    `
    Generate JavaScript code to execute html relevant task.
    You should always use querySelectorAll rather than querySelector, such as querySelector('#id1, #id2') to select elements.
    Then you do something to elements selected, such as add style, add event listener or appendChild.
    If code executes adding element task, code should use appendChild rather than innerHTML.
    Only generate code, no comment.
    Take a deep breath.

    task: """
    {task}
    """

    html dom: """
    {domString}
    """
    `
  )

  const chain = promptTemplate.pipe(model)

  const llmResult = await chain.invoke({
    domString: dom,
    task
  })

  return llmResult
}
