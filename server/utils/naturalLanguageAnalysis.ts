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
    User Input: A SaaS admin dashboard
    Output: <div class="flex flex-col w-full min-h-screen"><header class="flex items-center h-16 px-4 border-b shrink-0 md:px-6"><a class="flex items-center gap-2 text-lg font-semi bold sm:text-base mr-4" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><line x1="22" x2="2" y1="6" y2="6"></line><line x1="22" x2="2" y1="18" y2="18"></line><line x1="6" x2="6" y1="2" y2="22"></line><line x1="18" x2="18" y1="2" y2="22"></line></svg><span class="sr-only">SaaS Admin</span></a><nav class="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6"><a class="text-gray-500 dark:text-gray-400" href="#">Dashboard</a><a class="text-gray-500 dark:text-gray-400"href="#">Users</a><a class="text-gray-500 dark:text-gray-400" href="#">Products</a><a class="text-gray-500 dark:text-gray-400" href="#">Analytics</a><a class="text-gray-500 dark:text-gray-400"href="#">Settings</a></nav><div class="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4"><button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full ml-auto"><span class="sr-only">Toggle user menu</span></button></div></header><main class="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40"><div class="max-w-6xl w-full mx-auto grid gap-2"><h1 class="font-semibold text-3xl">Dashboard</h1></div><div class="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full mx-auto"><nav class="text-sm text-gray-500 grid gap-4 dark:text-gray-400"><a class="font-semibold text-gray-900 dark:text-gray-50" href="#">Overview</a><a href="#">Users</a><a href="#">Products</a><a href="#">Analytics</a><a href="#">Settings</a></nav><div class="grid gap-6"><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Users</h3><p class="text-sm text-muted-foreground">Manage your user profiles.</p></div><div class="p-6"><form><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"placeholder="Search Users"></form></div><div class="flex items-center border-t p-6"><button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">AddUser</button></div></div><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Products</h3><p class="text-sm text-muted-foreground">Overview of available products.</p></div><div class="p-6"><form class="flex flex-col gap-4"><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"placeholder="Search Products"></form></div><div class="flex items-center border-t p-6"><button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">AddProduct</button></div></div><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Analytics</h3><p class="text-sm text-muted-foreground">Insights into user behavior and key performance indicators.</p></div><div class="p-6"><div class="w-[50vw] aspect-[3/2]"><div style="width: 100%; height: 100%;"></div></div></div></div><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Settings</h3><p class="text-sm text-muted-foreground">Customize various aspects of the dashboard.</p></div><div class="p-6"><form class="flex flex-col gap-4"><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"placeholder="Theme" value="Light"><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"placeholder="Notifications" value="Enabled"><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"placeholder="Integrations" value="None"></form></div><div class="flex items-center border-t p-6"><button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Save</button></div></div></div></div></main></div>
    ##

    userInput: """
    {userPrompt}
    """
    `
  )

  const chain = promptTemplate.pipe(model)
  const parser = new StringOutputParser()
  const llmResult = config.streaming
    ? await chain.pipe(parser).stream({
        userPrompt
      })
    : await chain.pipe(parser).invoke({
        userPrompt
      })

  return llmResult
}

// <div><header><a><span>SaaS Admin</span></a><nav><a href="#">Users</a><a>Products</a><a href="#">Settings</a></nav><div><button><span>Toggle user menu</span></button></div></header><main><div><h1>Dashboard</h1></div><div><nav><a> Overview </a><a href="#">Users</a><a href="#">Products</a><a href="#">Analytics</a><ahref="#">Settings</a></nav><div><div><div><h3>Users</h3><p> Manage your user profiles. </p></div><div><form><input placeholder="Search Users"></form></div><div><button>Add User</button></div></div><div><div><h3>Products</h3><p> Overview of available products. </p></div><div><form><input placeholder="Search Products"></form></div><div><button>Add Product</button></div></div><div><div><h3>Analytics</h3><p> Insights into user behavior and key performance indicators. </p></div></div><div><div><h3>Settings</h3><p> Customize various aspects of the dashboard. </p></div><div><form><input placeholder="Theme"><input placeholder="Notifications" value="Enabled"><input placeholder="Integrations"></form></div><div><button>Save</button> </div></div></div></div></main></div>

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
