import Bookmark from 'src/models/bookmark'
import BookmarkRepository from 'src/repos/v2/bookmark'
import IBookmark from 'src/models/bookmark/types'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import Swal from 'sweetalert2'
import axios from 'axios'
import { makeAutoObservable } from 'mobx'

export default class BookmarkStore implements IStore {
  rootStore: RootStore
  routerStore: RouterStore
  bookmarks: Bookmark[] = []
  bookmarkRepository: BookmarkRepository
  bookmark: IBookmark = {
    text: '',
    _id: undefined,
    userId: '',
    userSimulationId: '',
    duration: 0,
    recordId: '',
    isDeleted: false,
    isPrivate: false,
  }
  form: any

  constructor(rootStore: RootStore, bookmarkRepository: BookmarkRepository) {
    this.rootStore = rootStore
    this.routerStore = rootStore.routerStore
    this.bookmarkRepository = bookmarkRepository
    makeAutoObservable(this)
  }

  loadData(data: IBookmark[]): void {
    this.bookmarks = data.map((item) => new Bookmark(this, item))
  }

  *changeStatus(id: string, isPrivate: boolean) {
    try {
      yield this.bookmarkRepository.update({
        filter: { _id: id },
        update: {
          isPrivate: isPrivate,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  *edit(userSimulationId: string): any {
    if (!this.bookmark.text) {
      return Swal.fire({
        title: 'empty text',
        icon: 'error',
      })
    }
    this.bookmark.recordId = this.rootStore.screenRecorderStore.recordId
    this.bookmark.userSimulationId = userSimulationId
    this.bookmark.userId = this.rootStore.authStore.user._id
    // AFTER FIX
    const current = this.rootStore.screenRecorderStore.video?.currentTime
    const start = this.rootStore.screenRecorderStore.duration
    const total = current! + start!
    this.bookmark.duration = total !== undefined ? total : 0
    let newBookmark = null

    try {
      newBookmark = yield this.bookmarkRepository.update({
        filter: { _id: this.bookmark._id },
        update: this.bookmark,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  *add(userSimulationId: string, start: any): any {
    if (!this.bookmark.text) {
      return Swal.fire({
        title: 'empty text',
        icon: 'error',
      })
    }
    this.bookmark.recordId = this.rootStore.screenRecorderStore.recordId
    this.bookmark.userSimulationId = userSimulationId
    this.bookmark.userId = this.rootStore.authStore.user._id
    // AFTER FIX
    const current = this.rootStore.screenRecorderStore.video?.currentTime
    // const start = this.rootStore.screenRecorderStore.duration
    const total = Number(current!) + Number(start!)
    this.bookmark.duration = total !== undefined ? total : 0

    let newBookmark = null

    try {
      newBookmark = yield this.bookmarkRepository.create(this.bookmark)
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  setText(text: string) {
    this.bookmark.text = text
  }

  *delete(bookmarkId: string) {
    try {
      yield this.bookmarkRepository.update({
        filter: { _id: bookmarkId },
        update: { isDeleted: true },
      })
    } catch (error) {
      return Swal.fire({
        title: 'Error',
        icon: 'error',
      })
    }
    // return Swal.fire({
    //   title: 'Succussfully Deleted',
    //   icon: 'success',
    // })
  }
}
