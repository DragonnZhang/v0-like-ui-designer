interface RuntimeState {
  createPagePrompt: string
  generatedPageHtml: string
  isGeneratingPage: boolean
}

export const useRuntimeState = () =>
  useState('runtimeState', () =>
    ref<RuntimeState>({
      createPagePrompt: '',
      generatedPageHtml: '',
      isGeneratingPage: false
    })
  )
