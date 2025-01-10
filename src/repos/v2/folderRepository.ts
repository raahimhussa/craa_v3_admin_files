import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import IFolder from 'src/models/folder/folder.interface'
class FolderRepository {
  url = 'v2/folders'

  constructor() {
    makeAutoObservable(this)
  }

  *create(body: any): any {
    const res: AxiosResponse<IFolder> = yield axios.post(this.url, body)
    return res.data
  }

  *find(params: any): any {
    const res: AxiosResponse<IFolder[]> = yield axios.get(this.url, { params })
    return res.data
  }

  *findOne(params: any): any {
    const res: AxiosResponse<IFolder> = yield axios.get(this.url + '/custom', {
      params,
    })
    return res.data
  }
  *findbyIds(params: any): any {
    const res: AxiosResponse<IFolder> = yield axios.get(this.url + '/custom', {
      params,
    })
    return res.data
  }

  *update(body: any): any {
    const res: AxiosResponse<IFolder[]> = yield axios.patch(this.url, body)
    return res.data
  }

  *delete(params: any) {
    const res: AxiosResponse<IFolder[]> = yield axios.delete(this.url, {
      params,
    })
    return res.data
  }
}
export default FolderRepository
