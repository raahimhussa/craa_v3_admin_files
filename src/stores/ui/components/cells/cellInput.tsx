import { action, makeObservable, observable, override } from "mobx"
import { RootStore } from "src/stores/root"
import UiState from "../.."
import UIStore from "../../uiStore"
// NOT USED
export default class CellInput extends UIStore {
  value: string | number = ''

  constructor(uiState: UiState) {
    super(uiState)
    makeObservable(this, {
      mutate: override,
      value: observable,
      enter: action
    })
  }

  enter(store: RootStore[keyof RootStore]) {

  }
}