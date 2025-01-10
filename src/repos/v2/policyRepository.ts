import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import IPolicy from 'src/models/policy/policy.interface'
class PolicyRepository {
  url = 'v2/policies'

  constructor() {
    makeAutoObservable(this)
  }

  *create(body: any): any {
    const res: AxiosResponse<IPolicy> = yield axios.post(this.url, body)
    return res.data
  }

  *find(params: any): any {
    const res: AxiosResponse<IPolicy[]> = yield axios.get(this.url, { params })
    return res.data
  }

  *findOne(params: any): any {
    const res: AxiosResponse<IPolicy> = yield axios.get(this.url + '/custom', {
      params,
    })
    return res.data
  }

  *update(body: any): any {
    const res: AxiosResponse<IPolicy[]> = yield axios.patch(this.url, body)
    return res.data
  }

  *delete(params: any) {
    const res: AxiosResponse<IPolicy[]> = yield axios.delete(this.url, {
      params,
    })
    return res.data
  }
}
export default PolicyRepository
