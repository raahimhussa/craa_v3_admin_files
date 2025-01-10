import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import DocumentVariable from 'src/models/documentVariable'
class DocumentVariableRepository {
  url = 'v1/documentVariables'

  constructor() {
    makeAutoObservable(this)
  }

  async create(body: any): Promise<AxiosResponse<DocumentVariable>> {
    return axios.post(this.url, body)
  }

  async find(params: any): Promise<AxiosResponse<DocumentVariable[]>> {
    return axios.get(this.url, { params })
  }

  async findOne(params: any): Promise<AxiosResponse<DocumentVariable>> {
    return axios.get(this.url, {
      params,
    })
  }

  async update(body: any): Promise<AxiosResponse<DocumentVariable[]>> {
    return axios.patch(this.url, body)
  }

  async delete(params: any): Promise<AxiosResponse<DocumentVariable[]>> {
    return axios.delete(this.url, {
      params,
    })
  }
}
export default DocumentVariableRepository
