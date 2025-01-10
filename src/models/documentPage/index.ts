import { DocumentType } from 'src/utils/status'
import { IModel } from '../types'
import { IDocumentPage } from './types'
import DocumentPageStore from 'src/stores/documentPageStore'
import { makeAutoObservable } from 'mobx'
import DocumentStore from 'src/stores/documentStore'

export default class DocumentPage implements IModel, IDocumentPage {
  _id: any = ''
  content: string = ''
  order: number = -2
  isDeleted: boolean = false
  createdAt: number = Date.now()
  updatedAt: number = Date.now()
  store: DocumentPageStore | null

  constructor(store: DocumentPageStore, data: IDocumentPage) {
    makeAutoObservable(this, {
      _id: false,
      store: false,
    })
    this.store = store || null
    Object.assign(this, data)
  }

  load(data: any) {
    Object.assign(this, data)
  }

  viewed() {}
}
