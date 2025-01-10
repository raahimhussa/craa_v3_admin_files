import { makeAutoObservable, toJS } from 'mobx'

import { DocumentType } from 'src/utils/status'
import { IDocumentPage } from 'src/models/documentPage/types'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import DocumentPage from 'src/models/documentPage'
import DocumentPageRepository from 'src/repos/v1/documentPage'
import _ from 'lodash'
import axios from 'axios'

export default class DocumentPageStore implements IStore {
  store: RootStore
  router: RouterStore
  documentPages: DocumentPage[] = []
  documentPageRepository: DocumentPageRepository
  form: IDocumentPage = {
    content: '',
    order: -1,
  }

  defaultForm: IDocumentPage = _.cloneDeep(this.form)
  mutate: any
  constructor(
    store: RootStore,
    documentPageRepository: DocumentPageRepository
  ) {
    this.store = store
    this.router = store.routerStore
    this.documentPageRepository = documentPageRepository
    makeAutoObservable(this)
  }

  loadData(data: DocumentPage[]) {
    this.documentPages = data.map((data) => {
      const documentPages = new DocumentPage(this, data)
      documentPages.load(data)
      return documentPages
    })
  }

  async create(page: any) {
    // this.resetForm()
    try {
      return (await this.documentPageRepository.create(page)).data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
  }
  async update(documentPageId: string, update: any) {
    try {
      return await this.documentPageRepository.update({
        filter: { _id: documentPageId },
        update,
      })
    } catch (error) {
      console.log({ error })
    }
    // this.mutate()
  }
  *delete(documentPageId: string) {
    try {
      yield this.documentPageRepository.update({
        filter: { _id: documentPageId },
        update: { isDeleted: true },
      })
    } catch (error) {
      throw error
    }
    this.mutate()
  }

  resetForm() {
    this.form = _.cloneDeep(this.defaultForm)
  }
}
