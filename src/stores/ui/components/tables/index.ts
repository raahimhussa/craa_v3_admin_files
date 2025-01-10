import ScreenRecordsState from 'src/ui/core/components/tables/ScreenRecords/State'
import { makeAutoObservable } from 'mobx'
import UiState from '../..'

export default class ScreenRecords {
  uiState: UiState
  screenRecords: ScreenRecordsState
  constructor(uiState: UiState) {
    this.uiState = uiState
    this.screenRecords = new ScreenRecordsState(uiState)
    makeAutoObservable(this, {
      uiState: false,
    })
  }
}
