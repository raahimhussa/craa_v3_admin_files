import { KeyedMutator } from 'swr'
import { RootStore } from 'src/stores/root'
import UiState from '..'
import axios from 'axios'
import { makeAutoObservable } from 'mobx'

export default class DetailLayout {
  uiState: UiState
  label: string = ''

  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false,
    })
  }

  *save(store: RootStore[keyof RootStore], mutate?: KeyedMutator<any> | null) {
    try {
      console.log("DetailLayout: ", store);
      // @ts-ignore
      if (!store.form._id) yield store.create()
      // @ts-ignore
      else yield store.update()
      this.uiState.modal.close()
      mutate && mutate()
    } catch (error) {
      throw error
    }
  }

  close() {
    this.uiState.modal.close()
  }
}
