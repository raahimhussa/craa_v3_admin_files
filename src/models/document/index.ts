import { DocumentType } from 'src/utils/status'
import { IModel } from '../types'
import { IDocument } from './types'
import { makeAutoObservable } from 'mobx'
import DocumentStore from 'src/stores/documentStore'

export default class Document implements IModel, IDocument {
  _id: any = ''
  title: string = ''
  versions: [] = []
  groupId: string = ''
  // versions: {} = {}
  isDeleted: boolean = false
  createdAt: number = Date.now()
  updatedAt: number = Date.now()
  store: DocumentStore | null

  constructor(store: DocumentStore, data: IDocument) {
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
