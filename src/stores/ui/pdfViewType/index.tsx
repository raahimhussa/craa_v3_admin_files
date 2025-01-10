import UiState from '..'
import { makeAutoObservable } from 'mobx'

export default class PdfViewType {
  uiState: UiState
  type: string = localStorage.getItem('pdf-view') || 'list'

  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false,
    })
  }
}
