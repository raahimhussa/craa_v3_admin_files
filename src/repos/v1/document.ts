import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import Document from 'src/models/document'
class DocumentRepository {
  url = 'v1/documents'

  constructor() {
    makeAutoObservable(this)
  }

  async create(body: any): Promise<AxiosResponse<Document>> {
    return axios.post(this.url, body)
  }

  async find(params: any): Promise<AxiosResponse<Document[]>> {
    return axios.get(this.url, { params })
  }

  async findOne(params: any): Promise<AxiosResponse<Document>> {
    return axios.get(this.url, {
      params,
    })
  }

  async update(body: any): Promise<AxiosResponse<Document[]>> {
    return axios.patch(this.url, body)
  }

  async delete(params: any): Promise<AxiosResponse<Document[]>> {
    return axios.delete(this.url, {
      params,
    })
  }
}
export default DocumentRepository
