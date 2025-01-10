import axios, { AxiosResponse } from 'axios'
import { makeAutoObservable } from 'mobx'
import IBookmark from 'src/models/bookmark/types'
class BookmarkRepository {
  url = 'v2/bookmarks'

  constructor() {
    makeAutoObservable(this)
  }

  *create(body: any): any {
    const res: AxiosResponse<IBookmark> = yield axios.post(this.url, body)
    return res.data
  }

  *find(params: any): any {
    const res: AxiosResponse<IBookmark[]> = yield axios.get(this.url, { params })
    return res.data
  }

  *findOne(params: any): any {
    const res: AxiosResponse<IBookmark> = yield axios.get(this.url + '/custom', {
      params,
    })
    return res.data
  }

  *update(body: any): any {
    const res: AxiosResponse<IBookmark[]> = yield axios.patch(this.url, body)
    return res.data
  }

  *delete(params: any) {
    const res: AxiosResponse<IBookmark[]> = yield axios.delete(this.url, {
      params,
    })
    return res.data
  }
}
export default BookmarkRepository
