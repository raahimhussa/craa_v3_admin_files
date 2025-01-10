import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import DocumentVariableGroup from 'src/models/documentVariableGroup'
class DocumentVariableGroupRepository {
  url = 'v1/documentVariableGroups'

  constructor() {
    makeAutoObservable(this)
  }

  async create(body: any): Promise<AxiosResponse<DocumentVariableGroup>> {
    return axios.post(this.url, body)
  }

  async find(params: any): Promise<AxiosResponse<DocumentVariableGroup[]>> {
    return axios.get(this.url, { params })
  }

  async findOne(params: any): Promise<AxiosResponse<DocumentVariableGroup>> {
    return axios.get(this.url, {
      params,
    })
  }

  async update(body: any): Promise<AxiosResponse<DocumentVariableGroup[]>> {
    return axios.patch(this.url, body)
  }

  async delete(params: any): Promise<AxiosResponse<DocumentVariableGroup[]>> {
    return axios.delete(this.url, {
      params,
    })
  }
}
export default DocumentVariableGroupRepository
