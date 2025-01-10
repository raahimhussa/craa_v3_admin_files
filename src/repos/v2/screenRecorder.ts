import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import { IScreenRecorder } from 'src/models/screenRecorder/IScreenRecorder'
class ScreenRecorderRepository {
  url = 'v2/screenRecorders'

  constructor() {
    makeAutoObservable(this)
  }

  *create(body: any): any {
    const res: AxiosResponse<IScreenRecorder> = yield axios.post(this.url, body)
    return res.data
  }

  *find(params: any): any {
    const res: AxiosResponse<IScreenRecorder[]> = yield axios.get(this.url, { params })
    return res.data
  }

  *findOne(params: any): any {
    const res: AxiosResponse<IScreenRecorder> = yield axios.get(this.url + '/custom', {
      params,
    })
    return res.data
  }

  *update(body: any): any {
    const res: AxiosResponse<IScreenRecorder[]> = yield axios.patch(this.url, body)
    return res.data
  }

  *delete(params: any) {
    const res: AxiosResponse<IScreenRecorder[]> = yield axios.delete(this.url, {
      params,
    })
    return res.data
  }
}
export default ScreenRecorderRepository
