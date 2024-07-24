<template>
  <div class="grid grid-cols-[300px_1fr] max-w-4xl w-full rounded-lg overflow-hidden border">
    <div class="bg-muted/20 p-3 border-r">
      <div class="flex items-center justify-between space-x-4">
        <div class="font-medium text-sm">Chats</div>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full w-8 h-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <span class="sr-only">New chat</span>
        </button>
      </div>
      <div class="py-4">
        <form>
          <input
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8"
            placeholder="Search chats"
          />
        </form>
      </div>
      <div class="grid gap-2">
        <a class="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 bg-muted" href="#">
          <span class="relative flex shrink-0 overflow-hidden rounded-full border w-10 h-10">
            <span class="flex h-full w-full items-center justify-center rounded-full bg-muted"
              >OM</span
            >
          </span>
          <div class="grid gap-0.5">
            <p class="text-sm font-medium leading-none">Sofia Davis</p>
            <p class="text-xs text-muted-foreground">Hey, are you free tonight? · 2h</p>
          </div>
        </a>
        <a class="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50" href="#">
          <span class="relative flex shrink-0 overflow-hidden rounded-full border w-10 h-10">
            <span class="flex h-full w-full items-center justify-center rounded-full bg-muted"
              >AJ</span
            >
          </span>
          <div class="grid gap-0.5">
            <p class="text-sm font-medium leading-none">Alex Johnson</p>
            <p class="text-xs text-muted-foreground">Sounds good, let's do it! · 45m</p>
          </div>
        </a>
        <a class="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50" href="#">
          <span class="relative flex shrink-0 overflow-hidden rounded-full border w-10 h-10">
            <span class="flex h-full w-full items-center justify-center rounded-full bg-muted"
              >MG</span
            >
          </span>
          <div class="grid gap-0.5">
            <p class="text-sm font-medium leading-none">Maria Gonzalez</p>
            <p class="text-xs text-muted-foreground">Can't wait for the weekend! · 1h</p>
          </div>
        </a>
      </div>
    </div>
    <div>
      <div class="p-3 flex border-b items-center">
        <div class="flex items-center gap-2">
          <span class="relative flex shrink-0 overflow-hidden rounded-full border w-10 h-10">
            <span class="flex h-full w-full items-center justify-center rounded-full bg-muted"
              >OM</span
            >
          </span>
          <div class="grid gap-0.5">
            <p class="text-sm font-medium leading-none">Sofia Davis</p>
            <p class="text-xs text-muted-foreground">Active 2h ago</p>
          </div>
        </div>
      </div>
      <div class="grid gap-4 p-3">
        <div
          class="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm ml-auto bg-primary text-primary-foreground"
        >
          Hey, are you free tonight? I was thinking we could grab dinner.
        </div>
        <div class="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm bg-muted">
          Sure, that sounds great! What time works for you?
        </div>
        <div
          class="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm ml-auto bg-primary text-primary-foreground"
        >
          How about 7pm at that new Italian place downtown?
        </div>
        <div class="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm bg-muted">
          Sounds good, I'll see you then!
        </div>
        <div
          class="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm ml-auto bg-primary text-primary-foreground"
        >
          Great, can't wait! 😊
        </div>
      </div>
      <div class="border-t">
        <form class="flex w-full items-center space-x-2 p-3">
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
            id="message"
            placeholder="Type your message..."
            autocomplete="off"
          />
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
            type="submit"
          >
            <span class="sr-only">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
