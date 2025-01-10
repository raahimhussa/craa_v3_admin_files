import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import DocumentPage from 'src/models/documentPage'
class DocumentPageRepository {
  url = 'v1/documentPages'

  constructor() {
    makeAutoObservable(this)
  }

  async create(body: any): Promise<AxiosResponse<DocumentPage>> {
    return axios.post(this.url, body)
  }

  async find(params: any): Promise<AxiosResponse<DocumentPage[]>> {
    return axios.get(this.url, { params })
  }

  async findOne(params: any): Promise<AxiosResponse<DocumentPage>> {
    return axios.get(this.url, {
      params,
    })
  }

  async update(body: any): Promise<AxiosResponse<DocumentPage[]>> {
    return axios.patch(this.url, body)
  }

  async delete(params: any): Promise<AxiosResponse<DocumentPage[]>> {
    return axios.delete(this.url, {
      params,
    })
  }
}
export default DocumentPageRepository
