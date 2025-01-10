import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import IFile from 'src/models/file/file.interface'
class FileRepository {
  url = 'v1/files'

  constructor() {
    makeAutoObservable(this)
  }

  async create(body: any): Promise<AxiosResponse<IFile>> {
    return axios.post(this.url, body)
  }

  async find(params: any): Promise<AxiosResponse<IFile[]>> {
    return axios.get(this.url, { params })
  }

  async findOne(params: any): Promise<AxiosResponse<IFile>> {
    return axios.get(this.url, {
      params,
    })
  }

  async update(body: any): Promise<AxiosResponse<IFile[]>> {
    return axios.patch(this.url, body)
  }

  async delete(params: any): Promise<AxiosResponse<IFile[]>> {
    return axios.delete(this.url, {
      params,
    })
  }
}
export default FileRepository
