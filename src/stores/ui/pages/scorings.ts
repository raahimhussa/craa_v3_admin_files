import { makeObservable, observable } from 'mobx'
import UiState from '..'
import UIStore from '../uiStore'

export default class Scorings extends UIStore {
  hasStarted: boolean = false
  constructor(uiState: UiState) {
    super(uiState)
    makeObservable(this, {
      _mutate: false,
      hasStarted: observable,
    })
  }
}
