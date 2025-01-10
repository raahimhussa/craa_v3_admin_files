import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx'
import {
  NavigateFunction,
  NavigateOptions,
  To,
  generatePath,
} from 'react-router-dom'

import { RootStore } from '../root'
import Swal from 'sweetalert2'

export interface IRoute {
  path: string
  checked: boolean
}

export default class RouterStore {
  router: NavigateFunction | undefined
  store: RootStore
  routePaths: any = {}
  currentRouteName: string = ''
  form: any
  delete: any
  // routeHanlder: IReactionDisposer

  constructor(store: RootStore, router?: NavigateFunction) {
    makeAutoObservable(this)
    this.router = router

    this.store = store
    // this.routeHanlder = reaction(
    //   () => this.currentRouteName,
    //   (value) => {
    //     if (this.store.authStore.user.role.title === 'SimScorer') {
    //       this.go('scorer:scoring')
    //     }
    //   }
    // )
  }

  setRouter(router: NavigateFunction) {
    this.router = router
  }

  go(routeName: string, params: any = null, options?: NavigateOptions) {
    let path: To = this.routePaths[routeName]
    this.currentRouteName = routeName
    if (params) {
      path = generatePath(path as string, params)
      console.log('path', path)
    }

    if(path) { // to avoid undefined 'path' issue
      this.router && this.router(path, options)
    }
  }

  setRoutePaths(routePaths: any) {
    this.routePaths = routePaths
  }
}
