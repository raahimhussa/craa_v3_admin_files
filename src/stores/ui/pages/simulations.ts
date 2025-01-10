import { makeObservable, override } from 'mobx'
import UIStore from 'src/stores/ui/uiStore'
import UiState from '..'

export default class Simulations extends UIStore {
  constructor(uiState: UiState) {
    super(uiState)
    makeObservable(this, {
      _mutate: false,
    })
  }
}
