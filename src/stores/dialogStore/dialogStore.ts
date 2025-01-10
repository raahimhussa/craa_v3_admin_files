import { AlertColor } from '@mui/material'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import { makeAutoObservable } from 'mobx'

// uiState로 이동 시켜야하는데 일단은 이렇게 개발
export default class DialogStore {
  store: RootStore
  router: RouterStore
  form: any
  delete: any

  dialog: {
    type: AlertColor
    isVisible: boolean
    title: string
    content: string | React.ReactNode
    buttons: Array<any>
  } = {
    type: 'error',
    isVisible: false,
    title: '',
    content: '',
    buttons: [],
  }

  constructor(store: RootStore) {
    this.store = store
    this.router = store.routerStore
    makeAutoObservable(this)
  }

  success(msg?: string) {
    this.dialog.type = 'success'
    this.dialog.title = 'Success'
    this.dialog.content = msg || 'Save Complete!'
    this.dialog.isVisible = true
  }

  failure(msg?: string) {
    this.dialog.type = 'error'
    this.dialog.title = 'Error!'
    this.dialog.content = msg || 'Creation failure!'
    this.dialog.isVisible = true
  }
}
