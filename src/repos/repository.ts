import axios, { AxiosResponse } from 'axios'

export default class Repository<T> {
  url: string
  constructor(url: string) {
    // console.log("Repository: ", url)
    this.url = url
  }

  async create(body: T): Promise<AxiosResponse<T>> {
    return axios.post(this.url, body)
  }

  async find(params: any): Promise<AxiosResponse<T[]>> {
    return axios.get(this.url, { params })
  }

  async findOne(params: any): Promise<AxiosResponse<T>> {
    return axios.get(this.url, {
      params,
    })
  }

  async update(body: any): Promise<AxiosResponse<T[]>> {
    return axios.patch(this.url, body)
  }

  async delete(params: any): Promise<AxiosResponse<T[]>> {
    return axios.delete(this.url, {
      params,
    })
  }
}
