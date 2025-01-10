import { IScreenRecorder } from 'src/models/screenRecorder/IScreenRecorder'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import { ScreenRecorder } from 'src/models/screenRecorder'
import ScreenRecorderRepository from 'src/repos/v2/screenRecorder'
import { makeAutoObservable } from 'mobx'
import axios from 'axios'

export default class ScreenRecorderStore implements IStore {
  rootStore: RootStore
  router: RouterStore
  screenRecorders: ScreenRecorder[] = []
  screenRecorderRepository: ScreenRecorderRepository
  girdSize: number = 12
  video: HTMLVideoElement | null = null
  videoIndex: number = 0
  recordId: string = ''
  isExist: boolean = false
  duration: number | undefined = 0
  form: any
  delete: any

  constructor(
    rootStore: RootStore,
    screenRecorderRepository: ScreenRecorderRepository
  ) {
    this.rootStore = rootStore
    this.router = rootStore.routerStore
    this.screenRecorderRepository = screenRecorderRepository
    this.duration = this.video?.duration
    makeAutoObservable(this)
  }

  loadData(data: IScreenRecorder[]) {
    this.screenRecorders = data.map((data: IScreenRecorder) => {
      return new ScreenRecorder(data)
    })
  }

  async checkFileExists(fileKey: string) {
    const param = {
      fileKey: fileKey,
    }
    // const data = await axios.post(
    //   'https://craa-sr-dev-3.hoansoft.com/v1/isExist',
    //   param
    // )
    const data = await axios.get(
      `https://craa-sr-data.s3.us-east-2.amazonaws.com/${fileKey}.webm`
    )
    // const data = await axios.post('http://0.0.0.0:4001/v1/isExist', param)
    // console.log(isExist)
    return data
  }

  play(duration: number, start: number) {
    // console.log(duration)
    // console.log(total)
    // if (this.video) {
    //   this.video?.pause()
    //   let sub = total - this.video.duration
    //   this.video.currentTime =
    //     this.videoIndex != 0 ? duration - sub - 3 : duration - 3
    //   this.video.play()
    // }
    console.log(duration)
    console.log(start)
    if (this.video) {
      this.video?.pause()
      this.video.currentTime = duration - start - 2
      this.video.play()
    }
  }

  playWithOpen(duration: number) {
    console.log(duration)
  }
}
