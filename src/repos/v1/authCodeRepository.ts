import axios from 'axios'
import { makeAutoObservable } from 'mobx'

export class AuthCodeRepository {
  URL = 'v1/authCodes'
  form: any
  delete: any

  constructor() {
    makeAutoObservable(this)
  }

  create(data: any) {
    return axios.post(this.URL, data)
  }

  find(params: any) {
    return axios.get(this.URL, { params })
  }

  *update(params: any) {
    let results = null
    try {
      // @ts-ignore
      const res = yield axios.patch(this.URL, params)
      results = res.data
    } catch (error) {
      console.error(error)
    }
    return results
  }

  deleteOne(params: any) {
    return axios.delete(this.URL, { params })
  }
}
