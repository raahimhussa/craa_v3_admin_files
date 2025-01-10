import UiState from '..'
import { makeAutoObservable } from 'mobx'

export default class Uploading {
  uiState: UiState
  isVisible: boolean = false
  isMinimized: boolean = false
  uploadFiles: {
    url: string
    mimeType: string
    fileName: string
    uploaded: boolean
  }[] = [
    // { mimeType: 'application/pdf', fileName: 'test1', uploaded: true },
    // { mimeType: 'application/pdf', fileName: 'test2', uploaded: false },
    // { mimeType: '', fileName: 'test3', uploaded: true },
  ]

  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false,
    })
  }

  add(uploadFile: {
    url: string
    mimeType: string
    fileName: string
    uploaded: boolean
  }) {
    this.uploadFiles = [...this.uploadFiles, uploadFile]
  }

  update(urls: string[]) {
    this.uploadFiles = [...this.uploadFiles].map((_uf) => {
      if (urls.includes(_uf.url)) return _uf
      return {
        ..._uf,
        uploaded: true,
      }
    })
  }

  open() {
    this.isVisible = true
  }

  minimize() {
    this.isMinimized = true
  }

  maximize() {
    this.isMinimized = false
  }

  close() {
    this.isVisible = false
  }

  clear() {
    this.uploadFiles = [...this.uploadFiles].filter((_uf) => !_uf.uploaded)
  }
}
