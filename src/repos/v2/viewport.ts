import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
class ViewportRepository {
  url = 'v2/viewports'

  constructor() {
    makeAutoObservable(this)
  }

  async create(body: any): Promise<AxiosResponse<any>> {
    return axios.post(this.url, body)
  }

  async find(params: any): Promise<AxiosResponse<any>> {
    return axios.get(this.url, {
      params,
    })
  }

  async findOne(params: any): Promise<AxiosResponse<any>> {
    return axios.get(this.url + '/custom', {
      params,
    })
  }

  async update(body: any): Promise<AxiosResponse<any>> {
    return axios.patch(this.url, body)
  }

  async delete(params: any): Promise<any> {
    return axios.delete(this.url, {
      params,
    })
  }
}
export default ViewportRepository
