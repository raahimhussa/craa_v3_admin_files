import { makeAutoObservable } from 'mobx'
import { IModal } from './types'

export default class Bookmark implements IModal {
  isVisible = false
  constructor() {
    makeAutoObservable(this)
  }

  close(): void {
    this.isVisible = false
  }

  open(): void {
    this.isVisible = true
  }
}
