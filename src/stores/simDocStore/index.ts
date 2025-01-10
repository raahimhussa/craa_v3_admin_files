import { makeAutoObservable, toJS } from 'mobx'

import { DocumentType } from 'src/utils/status'
import { ISimDoc } from 'src/models/simDoc/types'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import SimDoc from 'src/models/simDoc'
import SimDocRepository from 'src/repos/v1/simDoc'
import _ from 'lodash'
import axios from 'axios'

export default class SimDocStore implements IStore {
  store: RootStore
  router: RouterStore
  simDocs: SimDoc[] = []
  simDocRepository: SimDocRepository
  form: ISimDoc = {
    title: '',
    files: [],
    numberOfPillsToShow: 0,
    numberOfPillsTakenBySubject: 0,
    numberOfPillsPrescribed: 0,
    totalPage: 0,
    currentPage: 0,
    scale: 1,
    folderId: null,
    kind: DocumentType.Document,
    isActivated: false,
    visibleId: -1,
    documentId: null,
    label: ''
  }

  defaultForm: ISimDoc = _.cloneDeep(this.form)
  mutate: any
  constructor(store: RootStore, simDocRepository: SimDocRepository) {
    this.store = store
    this.router = store.routerStore
    this.simDocRepository = simDocRepository
    makeAutoObservable(this)
  }

  loadData(data: SimDoc[]) {
    this.simDocs = data.map((data) => {
      const simDoc = new SimDoc(this, data)
      simDoc.load(data)
      return simDoc
    })
  }

  async create(folderId: string) {
    this.resetForm()
    this.form.folderId = folderId
    // this.form.title = "Untitled"
    this.form.label = "Unlabeled"
    try {
      return (await this.simDocRepository.create(toJS(this.form))).data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    } finally {
      this.resetForm()
    }
  }
  *update(simDocId: string, update: any) {
  // update(simDocId: string, update: any) {
    try {
      yield this.simDocRepository.update({
      // return this.simDocRepository.update({
        filter: { _id: simDocId },
        update,
      })
    } catch (error) {
      console.log({ error })
    }
    this.mutate()
  }
  *delete(simDocId: string) {
    try {
      // yield this.simDocRepository.update({
      return this.simDocRepository.update({
        filter: { _id: simDocId },
        update: { isDeleted: true },
      })
    } catch (error) {
      throw error
    }
  }

  resetForm() {
    this.form = _.cloneDeep(this.defaultForm)
  }
}
