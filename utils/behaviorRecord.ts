import { throttle } from 'lodash'

type UserAction = {
  type: string
  timestamp: number
  details: any
}

class UserBehaviorTracker {
  private eventLog: UserAction[] = []
  private isDrawing: boolean = false // 标记是否在按下鼠标的状态
  private drawingTime = 0
  private drawingIndex = 0 // 每次绘画线的 id

  constructor(private throttleTime: number = 30) {
    this.initEventListeners()
  }

  // 初始化事件监听
  private initEventListeners() {
    // 鼠标按下时开始记录
    document.addEventListener('mousedown', this.startDrawing.bind(this))

    // 鼠标移动事件（只有在按下鼠标时才记录）
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
    this.isDrawing = true
  }

  // 停止绘制
  private stopDrawing(event: MouseEvent) {
    this.drawingTime = Date.now() - this.drawingTime
    this.isDrawing = false
  }

  // 记录鼠标移动事件（仅在 isDrawing 为 true 时记录）
  private recordMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return // 如果没有按下鼠标，不记录
    this.eventLog.push({
      type: 'mousemove',
      timestamp: Date.now(),
      details: {
        x: event.clientX,
        y: event.clientY,
        id: this.drawingIndex
      }
    })
    console.log('Mouse move recorded:', event.clientX, event.clientY)
  }

  // 记录鼠标点击事件
  private recordClick(event: MouseEvent) {
    if (this.drawingTime > 200) return // 如果正在绘制，则不记录点击事件

    this.eventLog.push({
      type: 'click',
      timestamp: Date.now(),
      details: {
        x: event.clientX,
        y: event.clientY
      }
    })
    console.log('Mouse click recorded:', event.clientX, event.clientY)
  }

  // 记录键盘按键事件
  private recordKeyPress(event: KeyboardEvent) {
    this.eventLog.push({
      type: 'keypress',
      timestamp: Date.now(),
      details: {
        key: event.key
      }
    })
    console.log('Key press recorded:', event.key)
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
}

export default UserBehaviorTracker
