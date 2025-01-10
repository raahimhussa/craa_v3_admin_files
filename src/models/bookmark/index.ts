import BookmarkStore from 'src/stores/bookmarkStore'
import IBookmark from './types'
import { makeAutoObservable } from 'mobx'

export default class Bookmark implements IBookmark {
  readonly _id: any = ''
  text: string = ''
  userId: string = ''
  isDeleted: boolean = false
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
  store: BookmarkStore
  duration: number = 0
  userSimulationId: string = ''
  isPrivate: boolean = false
  recordId: string = ''
  constructor(store: BookmarkStore, data: IBookmark) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }

  asJson() {
    return {
      text: this.text,
      userId: this.userId,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
