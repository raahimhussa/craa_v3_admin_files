import { makeObservable } from 'mobx'
import UiState from '..'
import UIStore from '../uiStore'

export default class AssessmentTypes extends UIStore {
  constructor(uiState: UiState) {
    super(uiState)
    makeObservable(this, {
      _mutate: false,
    })
  }
}
