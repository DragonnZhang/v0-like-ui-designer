<template>
  <div class="dark flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-md">
      <div class="bg-gray-800 shadow-lg rounded-lg px-8 py-6">
        <h2 class="text-2xl font-bold text-white text-center">Login</h2>
        <form class="mt-4">
          <div class="flex flex-col mb-4">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
              for="username"
              >Username</label
            ><input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 text-white bg-gray-900"
              id="username"
              type="text"
            />
          </div>
          <div class="flex flex-col mb-6">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
              for="password"
              >Password</label
            ><input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 text-white bg-gray-900"
              id="password"
              type="password"
            />
          </div>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 w-full py-2 bg-indigo-700 text-white rounded hover:bg-indigo-600"
            type="button"
          >
            Login
          </button>
        </form>
        <div class="text-center mt-4">
          <a class="text-sm text-indigo-200 hover:underline" href="#">Forgot your password?</a>
        </div>
        <div class="text-center mt-4">
          <span class="text-white">Don't have an account?</span
          ><a class="text-sm text-indigo-200 hover:underline ml-1" href="#">Create an account</a>
        </div>
      </div>
    </div>
  </div>
</template>
