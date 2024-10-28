import { StateGraph, Annotation, MessagesAnnotation } from '@langchain/langgraph/web'
import { tool } from '@langchain/core/tools'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { z } from 'zod'
import UserBehaviorTracker from './behaviorRecord'
import { QDollarRecognizer, Point } from './qdollar'
import { getModelInstance } from './llmAccessService'
import { AIMessage } from '@langchain/core/messages'
import { ChatPromptTemplate } from '@langchain/core/prompts'

/**
 * TODO:
 * 1. 接受 dom 元素输入
 * 2. 想一个好的展示用例
 * 3. 接收键盘输入（不只是鼠标轨迹）
 */

// 交互行为定义库, key 为动作名称, value 为交互行为描述
const behaviorDefinitions = new Map<string, string>()

// 手势识别函数
const qDollarRecognizer = new QDollarRecognizer()

// 手势记录
const gestureRecorder = new UserBehaviorTracker('F2')

// 模型实例
const model = getModelInstance()

/**
 * 记录用户键盘 & 鼠标操作 & 记录（用户动作名称，交互行为）到交互行为定义库
 * 这里持续记录用户操作，直到用户按某一个特殊的按键表示结束。之后通过 qDollarRecognizer.addGesture 添加到模型中。
 * @returns void
 */
const recordKeyboardAndMouseTool = tool(
  async (input: { behavior: string }) => {
    console.log('recordKeyboardAndMouseTool', input)
    const gestureData = await gestureRecorder.recordDrawing()

    const actionName = input.behavior
    qDollarRecognizer.addGesture(
      actionName,
      gestureData
        .filter((item) => item.details.x !== undefined && item.details.y !== undefined)
        .map((item) => {
          return new Point(item.details.x!, item.details.y!, item.details.id)
        })
    )
    behaviorDefinitions.set(actionName, input.behavior)
    console.log(`用户行为 ${actionName} 对应的交互行为已添加到模型中`)
    return { gestureData, action: actionName }
  },
  {
    name: 'recordKeyboardAndMouse',
    description: '记录用户键盘 & 鼠标操作',
    schema: z.object({
      behavior: z.string().describe('用户交互行为')
    })
  }
)

const gestureInputTools = [recordKeyboardAndMouseTool]
const gestureInputToolNode = new ToolNode(gestureInputTools)

// 交互行为识别 agent
const gestureModel = model.bindTools!(gestureInputTools)
const callGestureModel = async (state: typeof State.State) => {
  const { userInput } = state

  const systemTemplate = `
  The user's input is similar to: "Record my current operation, and when you encounter 
  this operation again, perform xx operation." Your task is to return the xx content 
  entered by the user. Only xx content is needed.
  `
  const humanTemplate = "User's input: {userInput}"

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  const chain = chatPrompt.pipe(gestureModel)

  const response = await chain.invoke({
    userInput
  })

  console.log('callGestureModel', response)

  // 这里强制调用工具，因为模型经常不调用工具
  return {
    userInput: response,
    messages: [
      new AIMessage({
        content: '',
        tool_calls: [
          {
            name: 'recordKeyboardAndMouse',
            args: {
              behavior: response.content
            },
            id: 'tool_call_id',
            type: 'tool_call'
          }
        ]
      })
    ]
  }
}

/**
 * 执行 js 代码
 */
const executeCodeTool = tool(
  (input: { code: string }) => {
    console.log('executeCodeTool', input)
    try {
      eval(input.code)
    } catch (error) {
      console.error(`代码执行失败: ${error}`)
    }
  },
  {
    name: 'executeCode',
    description: '执行 JavaScript 代码',
    schema: z.object({
      code: z.string().describe('要执行的 JavaScript 代码')
    })
  }
)
const executeCodeTools = [executeCodeTool]
const executeCodeToolNode = new ToolNode(executeCodeTools)

// 根据交互行为生成代码 agent
const generateCodeModel = model.bindTools!(executeCodeTools)
const callGenerateCodeModel = async (state: typeof State.State) => {
  const action = qDollarRecognizer.recognize(state.gestureData)
  const behavior = behaviorDefinitions.get(action.Name)

  console.log('behavior', behavior)

  const systemTemplate = `
  Suppose you are a programmer and you need to generate executable js code to complete the user's task. 
  You need to ensure that the code can directly achieve the user's task through eval execution. 
  The code format is: function f() {{ ... }} f(); Don't wrap the code with \`\`\`javascript markdown format.

  Example 1:
  If the user's task is "Copy the text selected by the mouse", you should return the following code:
  function f() {{ const text = window.getSelection().toString(); navigator.clipboard.writeText(text); }} f();

  Pay Attention:
  1. Please return executable code string, without using markdown syntax like \`\`\`javascript.
  `

  const humanTemplate = "User's task: {task}"

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  const chain = chatPrompt.pipe(generateCodeModel)

  const response = await chain.invoke({
    task: behavior
  })

  console.log('callGenerateCodeModel', response)

  function removeCodeWrapper(code: string): string {
    return code.replace(/^```javascript\s*|\s*```$/g, '').trim()
  }

  const cleanedCode = removeCodeWrapper(response.content || response.tool_calls![0].args.code)

  return {
    messages: [
      new AIMessage({
        content: '',
        tool_calls: [
          {
            name: 'executeCode',
            args: {
              code: cleanedCode
            },
            id: 'tool_call_id_2',
            type: 'tool_call'
          }
        ]
      })
    ]
  }
}

// 修改交互行为 agent
const modifyBehaviorModel = model.bindTools!([])
const callModifyBehaviorModel = async (state: typeof State.State) => {
  const { userInput, gestureData } = state
  const action = qDollarRecognizer.recognize(gestureData)

  const systemTemplate = `
  The user has input a command to modify the existing interaction behavior. Your task is to parse 
  this command and extract the new interaction behavior description.
  Return only the new interaction behavior description, without any additional explanation.
  `
  const humanTemplate = '用户输入: {userInput}'

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', humanTemplate]
  ])

  const chain = chatPrompt.pipe(modifyBehaviorModel)

  const response = await chain.invoke({
    userInput
  })

  console.log('callModifyBehaviorModel', response)

  // 更新交互行为定义库
  behaviorDefinitions.set(action.Name, response.content as string)

  return {
    messages: [new AIMessage({ content: `交互行为已更新为: ${response.content}` })]
  }
}

// agent 调度：如果传入的 gestureData 为空，则选择 intentAgent，否则选择 codeAgent
function chooseAgent(state: typeof State.State) {
  const { userInput, gestureData } = state
  if (userInput !== '' && gestureData.length !== 0) {
    return 'modifyBehaviorAgent'
  }
  if (userInput === '') {
    return 'codeAgent'
  }
  return 'intentAgent'
}

// 定义全局 state
const State = Annotation.Root({
  ...MessagesAnnotation.spec,
  userInput: Annotation<string>, // 用户输入的原始提示词
  gestureData: Annotation<Point[]>, // 用户手势数据
  code: Annotation<string>, // 生成的代码
  action: Annotation<string> // 识别到的动作名称
})

const workflow = new StateGraph(State)
  .addNode('intentAgent', callGestureModel)
  .addNode('codeAgent', callGenerateCodeModel)
  .addNode('modifyBehaviorAgent', callModifyBehaviorModel)
  .addNode('gestureInput', gestureInputToolNode)
  .addNode('executeCode', executeCodeToolNode)
  .addConditionalEdges('__start__', chooseAgent)
  .addEdge('intentAgent', 'gestureInput')
  .addEdge('gestureInput', '__end__')
  .addEdge('codeAgent', 'executeCode')
  .addEdge('executeCode', '__end__')
  .addEdge('modifyBehaviorAgent', '__end__')

// 编译工作流
const app = workflow.compile()

// 使用工作流
export async function handleUserInput(userInput: string, gestureData: Point[]) {
  const result = await app.invoke({
    userInput,
    gestureData
  })

  console.log('handleUserInput', result)

  return result
}
