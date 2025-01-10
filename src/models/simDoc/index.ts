import { DocumentType } from 'src/utils/status'
import { IModel } from '../types'
import { ISimDoc } from './types'
import SimDocStore from 'src/stores/simDocStore'
import { makeAutoObservable } from 'mobx'

export default class SimDoc implements IModel, ISimDoc {
  _id: any = ''
  title: string = ''
  visibleId: number = -1
  kind: DocumentType = DocumentType.Document
  files: any[] = []
  numberOfPillsToShow: number = 0
  numberOfPillsTakenBySubject: number = 0
  numberOfPillsPrescribed: number = 0
  children: Array<any> = []
  expanded: boolean = false
  isActivated: boolean = true
  isDeleted: boolean = false
  createdAt: number = Date.now()
  updatedAt: number = Date.now()
  totalPage: number = 2
  currentPage: number = 1
  scale: number = 1
  store: SimDocStore | null
  isViewed?: boolean = false
  seq?: number | undefined
  folderId: string | null = null
  documentId: string | null = null
  label: string = ''

  constructor(store: SimDocStore, data: ISimDoc) {
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
