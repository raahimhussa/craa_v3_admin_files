import { makeAutoObservable } from 'mobx'
import UiState from '..'

export default class AdminLayout {
  isDrawerOpen: boolean = true
  uiState: UiState

  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false,
    })
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen
  }
}
