import FolderStore from 'src/stores/folderStore'
import IFolder from 'src/models/folder/folder.interface'
import { IModel } from '../types'
import SimDoc from '../simDoc'
import { makeAutoObservable } from 'mobx'

export default class Folder implements IModel, IFolder {
  store: FolderStore
  _id: any
  name: string = ''
  depth: number = 0
  folderId: string = ''
  isActivated: boolean = true
  isDeleted: boolean = false
  createdAt: Date | null = null
  updatedAt: Date | null = null
  children: Array<SimDoc | Folder> | undefined
  expanded: any
  label: string = ''

  constructor(store: FolderStore, data: IFolder) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }

  load(data: any) {
    Object.assign(this, data)
  }
}
