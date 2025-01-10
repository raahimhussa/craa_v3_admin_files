import axios, { AxiosResponse } from 'axios'

import FileModel from 'src/models/file'
import FileRepository from 'src/repos/v1/file'
import IFile from 'src/models/file/file.interface'
import { IStore } from '../types'
import { RootStore } from '../root'
import { makeAutoObservable } from 'mobx'

export type FileItem = {
  index?: number
  name: string
  size?: number
  mimeType: string
  url?: string
  signedUrl?: string  
}

export type CraaButtonProps = {
  state: any
  path: string
  image?: boolean
  pdf?: boolean
}
export default class FileStore implements IStore {
  rootStore: RootStore
  repository: FileRepository
  files: FileModel[] = []
  form: IFile = {
    mimeType: '',
    name: '',
    url: '',
  }

  constructor(rootStore: RootStore, repository: FileRepository) {
    this.rootStore = rootStore
    this.repository = repository
    makeAutoObservable(this)
  }

  loadData(data: any) {
    this.files = data.map((file: IFile) => new FileModel(this, file))
  }

  setForm(data: IFile) {
    this.form = data
  }

  *save() {
    const isEditMode = this.form._id ? true : false
    try {
      if (isEditMode) yield this.update()
      else yield this.create()
    } catch (error) {
      this.rootStore.uiState.alert.error()
    }
    this.rootStore.uiState.alert.success()

    this.mutate()
  }

  *create(): any {
    const res = yield this.repository.create(this.form)
  }

  *update() {
    yield this.repository.create(this.form)
    this.formReset()
    this.mutate()
  }

  *delete() {
    yield this.repository.delete({
      filter: { _id: this.form._id },
      update: { isDeleted: true },
    })
    this.formReset()
    this.mutate()
  }

  formReset() {
    const form: IFile = {
      mimeType: '',
      name: '',
      url: '',
    }
    this.form = form
  }

  mutate() {
    if (this.rootStore.uiState.files.mutate)
      this.rootStore.uiState.files.mutate()
  }

  *postFile(fileItem: FileItem) {
    let result = null
    try {
      const res: AxiosResponse = yield axios.post('v1/files', fileItem)
      result = res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
    return result
  }

  *updateFile(fileItem: FileItem, fileId: string) {
    let result = null
    try {
      const res: AxiosResponse = yield axios.patch('v1/files', {
        filter: { _id: fileId },
        update: fileItem,
      })
      result = res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
    return result
  }

  *putFileToS3(signedUrl: string, file: File) {
    try {
      yield axios.put(signedUrl, file)
    } catch (error) {
      console.error(error)
    }
  }

  *S3Sign(filename: string, type: string) {
    let result: FileItem | null = null
    const file = {
      name: filename,
      type: type,
    }

    try {
      const res: AxiosResponse = yield axios.post('v1/files/sign', file)
      result = res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
    return result
  }

  *singleUpload(file: File | Blob, fileId?: string) {
    try {
      const convertedFile: File = this.convertBlobToFile(file)

      const filename = convertedFile.name
      const type = convertedFile.type

      const { signedUrl, url } = yield this.S3Sign(filename, type)

      yield this.putFileToS3(signedUrl!, convertedFile)

      const fileItem: FileItem = this.buildFileItem(convertedFile, url)

      if (fileId) return (yield this.updateFile(fileItem, fileId)) as FileItem
      else return (yield this.postFile(fileItem)) as FileItem
    } catch (error) {
      throw error
    }
  }

  *multiUpload(files: FileList) {}

  buildFileItem(file: File, url: string) {
    const fileItem: FileItem = {
      name: file.name,
      mimeType: file.type,
      size: file.size,
      url: url,
    }
    return fileItem
  }

  convertBlobToFile(file: File | Blob): File {
    if (file instanceof File) {
      return file
    }
    const filename = String(Math.floor(Math.random() * 90000) + 10000)

    const _file: File = new File([file], filename, { type: file.type })

    return _file
  }
}
