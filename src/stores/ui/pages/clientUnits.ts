import UIStore from '../uiStore'
import UiState from '..'
import { makeObservable } from 'mobx'

export default class ClientUnits extends UIStore {
  constructor(uiState: UiState) {
    super(uiState)
    makeObservable(this, {
      _mutate: false,
    })
  }
}
