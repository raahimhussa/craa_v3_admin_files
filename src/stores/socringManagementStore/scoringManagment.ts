import { AlertColor } from '@mui/material'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import { makeAutoObservable } from 'mobx'

// uiState로 이동 시켜야하는데 일단은 이렇게 개발
export default class ScoringManagementStore {
  store: RootStore
  router: RouterStore
  form: any
  delete: any

  notPublishedTableMutate: any
  notPublishedTableCountMutate: any
  publishedTableMutate: any
  publishedTableCountMutate: any

  constructor(store: RootStore) {
    this.store = store
    this.router = store.routerStore
    makeAutoObservable(this)
  }
}
