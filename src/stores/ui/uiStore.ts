import { makeObservable } from 'mobx'
import Mutatable from 'src/commons/interfaces/mutatable.interface'
import { KeyedMutator } from 'swr'
import UiState from '.'
export default class UIStore implements Mutatable {
  _mutate: KeyedMutator<any> | null = null
  uiState: UiState

  constructor(uiState: UiState) {
    this.uiState = uiState
    makeObservable(this, {
      _mutate: false,
    })
  }

  public get mutate(): KeyedMutator<any> | null {
    return this._mutate
  }
  public set mutate(value: KeyedMutator<any> | null) {
    this._mutate = value
  }
}
