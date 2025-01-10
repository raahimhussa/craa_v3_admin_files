import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import Viewport from 'src/models/viewport'
import ViewportRepository from 'src/repos/v2/viewport'
import { makeAutoObservable } from 'mobx'

export default class ViewportStore implements IStore {
  rootStore: RootStore
  router: RouterStore
  viewports: Viewport[] = []
  viewportRepository: ViewportRepository
  girdSize: number = 12
  form: any
  delete: any

  constructor(rootStore: RootStore, viewportRepository: ViewportRepository) {
    this.rootStore = rootStore
    this.router = rootStore.routerStore
    this.viewportRepository = viewportRepository
    makeAutoObservable(this, {
      rootStore: false,
    })
  }

  loadData(data: Viewport[]) {
    this.viewports = data.map((data) => {
      const viewport = new Viewport(this)
      viewport.load(data)
      return viewport
    })
  }

  getGridSize() {
    if (this.getMountedViewportCount() > 0) {
      if (this.getMountedViewportCount() > 2) {
        return this.girdSize / 2
      }
      return this.girdSize / this.getMountedViewportCount()
    }
    return this.girdSize
  }

  getMountedViewportCount() {
    return this.mountedViewports().length
  }

  getActiveViewport() {
    return this.viewports.find((viewport) => viewport.active)
  }

  mountedViewports() {
    return this.viewports?.filter((viewport: Viewport) => viewport.isMounted)
  }

  unmountedViewports() {
    return this.viewports?.filter((viewport: Viewport) => !viewport.isMounted)
  }

  addViewport() {
    const unmountedViewport = this.unmountedViewports()[0]
    if (!unmountedViewport) return null
    unmountedViewport.isMounted = true
    this.viewportRepository.update({
      filter: { _id: unmountedViewport._id },
      update: {
        isMounted: true,
      },
    })
  }
}
