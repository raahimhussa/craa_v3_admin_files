import { IModel } from '../types'
import { IDocumentVariableGroup } from './types'
import { makeAutoObservable } from 'mobx'
import DocumentVariableGroupStore from 'src/stores/documentVariableGroupStore'

export default class DocumentVariableGroup
  implements IModel, IDocumentVariableGroup
{
  _id: any = ''
  name: string = ''
  isDeleted: boolean = false
  createdAt: number = Date.now()
  updatedAt: number = Date.now()
  store: DocumentVariableGroupStore | null

  constructor(store: DocumentVariableGroupStore, data: IDocumentVariableGroup) {
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
