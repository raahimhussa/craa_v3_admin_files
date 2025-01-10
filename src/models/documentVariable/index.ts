import { IModel } from '../types'
import { IDocumentVariable } from './types'
import { makeAutoObservable } from 'mobx'
import DocumentVariableStore from 'src/stores/documentVariableStore'

export default class DocumentVariable implements IModel, IDocumentVariable {
  _id: any = ''
  key: string = ''
  value: string = ''
  groupId: string = ''
  isDeleted: boolean = false
  createdAt: number = Date.now()
  updatedAt: number = Date.now()
  store: DocumentVariableStore | null

  constructor(store: DocumentVariableStore, data: IDocumentVariable) {
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
