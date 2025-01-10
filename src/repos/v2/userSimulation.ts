import axios, { AxiosResponse } from 'axios'

import UserSimulation from 'src/models/userSimulation'
import { makeAutoObservable } from 'mobx'
class UserBaselineRepository {
  url = 'v2/userBaselines'

  constructor() {
    makeAutoObservable(this)
  }
  loadData(data: any) {}
  async create(body: any): Promise<UserSimulation> {
    const res: AxiosResponse<UserSimulation> = await axios.post(this.url, body)
    return res.data
  }

  async find(params: any): Promise<UserSimulation[] | undefined> {
    const res: AxiosResponse<UserSimulation[]> = await axios.get(this.url, {
      params,
    })
    return res.data
  }

  async findOne(params: any): Promise<UserSimulation | undefined> {
    const res: AxiosResponse<UserSimulation> = await axios.get(
      this.url + '/custom',
      {
        params,
      }
    )
    return res.data
  }

  async update(body: any): Promise<UserSimulation[] | undefined> {
    const res: AxiosResponse<UserSimulation[]> = await axios.patch(
      this.url,
      body
    )
    return res.data
  }

  async delete(params: Promise<UserSimulation[] | undefined>) {
    const res: AxiosResponse<UserSimulation[]> = await axios.delete(this.url, {
      params,
    })
    return res.data
  }
}
export default UserBaselineRepository
