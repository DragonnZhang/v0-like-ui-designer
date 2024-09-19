import { throttle } from 'lodash'

type UserAction = {
  type: string
  timestamp: number
  details: any
}

class UserBehaviorTracker {
  private eventLog: UserAction[] = []

  constructor(private throttleTime: number = 200) {
    this.initEventListeners()
  }

  // 初始化事件监听
  private initEventListeners() {
    // 使用 lodash 的 throttle 处理鼠标移动事件
    document.addEventListener(
      'mousemove',
      throttle(this.recordMouseMove.bind(this), this.throttleTime)
    )

    // 鼠标点击事件
    document.addEventListener('click', this.recordClick.bind(this))

    // 键盘按键事件
    document.addEventListener('keydown', this.recordKeyPress.bind(this))

    // 可以扩展其他需要监听的事件
  }

  // 记录鼠标移动事件
  private recordMouseMove(event: MouseEvent) {
    this.eventLog.push({
      type: 'mousemove',
      timestamp: Date.now(),
      details: {
        x: event.clientX,
        y: event.clientY
      }
    })
    console.log('Mouse move recorded:', event.clientX, event.clientY)
  }

  // 记录鼠标点击事件
  private recordClick(event: MouseEvent) {
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

  // 获取已记录的事件
  public getEventLog() {
    return JSON.stringify(this.eventLog)
  }

  // 清除事件日志
  public clearEventLog() {
    this.eventLog = []
  }

  // 模拟发送数据到服务器
  public sendToServer() {
    if (this.eventLog.length > 0) {
      console.log('Sending event log to server:', this.eventLog)
      // 模拟发送数据，这里你可以用 fetch() 或其他 API 发送数据到后端
      this.clearEventLog()
    }
  }
}

export default UserBehaviorTracker
