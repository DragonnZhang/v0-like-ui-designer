import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { getModelInstance } from './llmAccessService'
import { StringOutputParser } from '@langchain/core/output_parsers'

const config = useRuntimeConfig()

const model = getModelInstance()

export const generateHTMLFromNaturalLanguage = async (userPrompt: string) => {
  const systemTemplate = `
  You are a web ui designer. Create a web page based on user input and is styled using Tailwind CSS.
  The design should be modern and minimalistic, providing a user-friendly interface.

  Here are something you need to pay attention:
  1.Analysis of User Input: Begin by deciphering the business logic conveyed through user input. Then, design the page layout and features based on this logic.
  2.Image Handling: For image elements, set the src attribute to '/placeholder.svg'. This ensures a consistent placeholder image is used where necessary.
  3.SVG Integration: If an SVG is used, it should be contextually appropriate and serve as an icon reflective of its function. Ensure to embed the SVG directly into the DOM.
  4.Design Aesthetic: Embrace a contemporary and minimalist design style. This should be reflected in the choice of colors, typography, spacing, and overall layout.
  5.Functionality and Interactivity: The core purpose of the page is to display user data effectively. Incorporate basic interactive elements like buttons or links to enhance user engagement.
  
  Note:Please generate the HTML code directly without using Markdown code block format(do not start with \`\`\`html or end with \`\`\`).
  `
  const humanTemplate = '{userPrompt}'

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  const chain = chatPrompt.pipe(model)
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

// ##
// First, you need to analyze user's input and determine the structure and content of the web page.
// Pay attention to the needs of users and analyze what core components the needs described by users should include.
// Then, generate HTML strings for each part, using appropriate tags and attributes.
// Next, add tailwindcss classes to each element to achieve the desired style effect.
// Pay attention to the spacing between elements. Keep the page beautiful and modern.
// Finally, you should return an HTML string that contains all parts, which is the final web page.
// ##

// Example1:
// ##
// User Input: A landing page for my design portfolio
// Output:
// <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900"><header class="px-4 lg:px-6 h-16 flex items-center"><a class="flex items-center justify-center" href="#" rel="ugc">牛<span class="sr-only">My Portfolio</span></a><nav class="ml-auto flex gap-4 sm:gap-6"><a class="text-sm font-medium hover:underline underline-offset-4" href="#" rel="ugc">Projects</a><a class="text-sm font-medium hover:underline underline-offset-4" href="#" rel="ugc">Contact</a></nav></header><main class="flex-1"><section class="w-full py-20 sm:py-32 md:py-48 lg:py-64 bg-gray-100 dark:bg-gray-800"><div class="container px-4 md:px-6"><div class="flex flex-col items-center text-center space-y-4"><h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">Hi, I'm Your Name</h1><p class="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">I'm a UI/UX designer with a passion for creating beautiful and intuitive digital experiences.</p></div></div></section><section id="projects" class="w-full py-12 md:py-24 lg:py-32"><div class="container px-4 md:px-6"><h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-12">My Projects</h2><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><img src="/placeholder.svg" alt="Project 1" class="w-full h-48 object-cover" width="200" height="200" style="aspect-ratio:200/200;object-fit:cover"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Project 1</h3></div><div class="p-6"><p class="text-gray-500 dark:text-gray-400">A brief description of Project 1.</p></div></div><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><img src="/placeholder.svg" alt="Project 2" class="w-full h-48 object-cover" width="200" height="200" style="aspect-ratio:200/200;object-fit:cover"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Project 2</h3></div><div class="p-6"><p class="text-gray-500 dark:text-gray-400">A brief description of Project 2.</p></div></div><div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card"><img src="/placeholder.svg" alt="Project 3" class="w-full h-48 object-cover" width="200" height="200" style="aspect-ratio:200/200;object-fit:cover"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Project 3</h3></div><div class="p-6"><p class="text-gray-500 dark:text-gray-400">A brief description of Project 3.</p></div></div></div></div></section><section id="contact" class="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"><div class="container px-4 md:px-6"><h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-12">Contact Me</h2><form class="max-w-md mx-auto space-y-4"><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="name" placeholder="Your Name" required=""><input type="email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="email" placeholder="Your Email" required=""><textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="message" placeholder="Your Message" required=""></textarea><button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full" type="submit">Send Message</button></form></div></section></main><footer class="flex items-center justify-center h-16 px-4 lg:px-6 border-t"><p class="text-xs text-gray-500 dark:text-gray-400">© Your Name. All rights reserved.</p></footer></div>
// ##

// Example2:
// ##
// User Input: An ecommerce dashboard with a table of recent orders
// Output:
// <div class="flex flex-col"><header class="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40"><div class="flex-1"><h1 class="font-semibold text-lg">Recent Orders</h1></div></header><main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6"><div class="border shadow-sm rounded-lg p-2"><div class="relative w-full overflow-auto"><table class="w-full caption-bottom text-sm"><thead class="[&amp;_tr]:border-b"><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"><th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[100px]">Order</th><th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 min-w-[150px]">Customer</th><th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">Date</th><th class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">Total</th><th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">Status</th></tr></thead><tbody class="[&amp;_tr:last-child]:border-0"><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">#3210</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Olivia Martin</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">February 20, 2024</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">$42.25</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">Shipped</td></tr><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">#3209</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Ava Johnson</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">January 5, 2024</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">$74.99</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">Paid</td></tr><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">#3204</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Michael Johnson</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">August 3, 2023</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">$64.75</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">Unfulfilled</td></tr></tbody></table></div></div></main></div></div>
// ##

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
