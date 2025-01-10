import { makeAutoObservable } from 'mobx'
import UiState from 'src/stores/ui'
export default class ScreenRecordsState {
  tabs = [
    {
      text: 'Logs',
      selected: true,
    },
    {
      text: 'Notes',
      selected: false,
    },
    {
      text: 'Bookmarks',
      selected: false,
    },
  ]

  uiState: UiState
  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false,
    })
  }

  selectedTab() {
    return this.tabs.find((tab) => tab.selected)!
  }

  onClickTab(text: string) {
    this.tabs.map((tab) => {
      if (tab.text === text) {
        tab.selected = true
      } else {
        tab.selected = false
      }
    })
  }
}
