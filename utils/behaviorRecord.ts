import { throttle } from 'lodash'

type UserAction = {
  type: string
  timestamp: number
  details: any
}

class UserBehaviorTracker {
  private eventLog: UserAction[] = []
  private drawingTime = 0
  private drawingIndex = 0 // 每次绘画线的 id
  private isRecording: boolean = false // 标记是否正在记录
  private recordingEvents: UserAction[] = [] // 记录绘画事件的数组

  constructor(
    private key: string = 'Meta',
    private throttleTime: number = 30
  ) {
    // 确定有 dom 元素
    if (document) {
      this.initEventListeners()
    }
  }

  // 初始化事件监听
  private initEventListeners() {
    // 鼠标按下时开始记录
    document.addEventListener('mousedown', this.startDrawing.bind(this))

    // 鼠标移动事件（无论是否按下鼠标都记录）
    document.addEventListener(
      'mousemove',
      throttle(this.recordMouseMove.bind(this), this.throttleTime)
    )

    // 鼠标松开时停止记录
    document.addEventListener('mouseup', this.stopDrawing.bind(this))

    // 记录鼠标点击事件
    document.addEventListener('click', this.recordClick.bind(this))

    // 键盘按键事件
    document.addEventListener('keydown', this.recordKeyPress.bind(this))

    // 可以扩展其他需要监听的事件
  }

  // 开始绘制
  private startDrawing(event: MouseEvent) {
    this.drawingIndex++
    this.drawingTime = Date.now()
  }

  // 停止绘制
  private stopDrawing(event: MouseEvent) {
    this.drawingTime = Date.now() - this.drawingTime
  }

  // 记录鼠标移动事件（无论是否按下鼠标都记录）
  private recordMouseMove(event: MouseEvent) {
    const action: UserAction = {
      type: 'mousemove',
      timestamp: Date.now(),
      details: {
        x: event.clientX,
        y: event.clientY,
        id: this.drawingIndex
      }
    }
    this.eventLog.push(action)
    if (this.isRecording) {
      this.recordingEvents.push(action)
    }
  }

  // 记录鼠标点击事件
  private recordClick(event: MouseEvent) {
    if (this.drawingTime > 200) return // 如果正在绘制，则不记录点击事件

    const action: UserAction = {
      type: 'click',
      timestamp: Date.now(),
      details: {
        x: event.clientX,
        y: event.clientY,
        id: this.drawingIndex
      }
    }
    this.eventLog.push(action)
    if (this.isRecording) {
      this.recordingEvents.push(action)
    }
  }

  // 记录键盘按键事件
  private recordKeyPress(event: KeyboardEvent) {
    const action: UserAction = {
      type: 'keypress',
      timestamp: Date.now(),
      details: {
        key: event.key
      }
    }
    this.eventLog.push(action)
    if (this.isRecording) {
      this.recordingEvents.push(action)
    }
  }

  public resetDrawingIndex() {
    this.drawingIndex = 0
  }

  // 获取已记录的事件
  public getEventLog() {
    return this.eventLog
  }

  // 清除事件日志
  public clearEventLog() {
    this.eventLog = []
  }

  // 异步记录用户绘画笔迹
  public async recordDrawing(): Promise<UserAction[]> {
    return new Promise((resolve) => {
      let controlPressed = false

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === this.key) {
          if (!controlPressed) {
            // 开始记录
            this.isRecording = true
            this.recordingEvents = []
            controlPressed = true
            console.log('开始记录绘画笔迹')
          } else {
            // 结束记录
            this.isRecording = false
            controlPressed = false
            document.removeEventListener('keydown', handleKeyDown)
            console.log('结束记录绘画笔迹')
            resolve(this.recordingEvents)
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)
    })
  }
}

export default UserBehaviorTracker
