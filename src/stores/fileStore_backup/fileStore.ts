import axios, { AxiosResponse } from 'axios'

import { RootStore } from '../root'
import RouterStore from '../routerStore'
import { makeAutoObservable } from 'mobx'
export type FileData = Array<FileItem>
/**
 * @FileItem url signedUrl은 서버에서 생성
 *
 */
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

export default class FileStore {
  store: RootStore
  router: RouterStore

  constructor(store: RootStore) {
    this.store = store
    this.router = store.routerStore
    makeAutoObservable(this)
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

  *singleUpload(file: File | Blob) {
    try {
      const convertedFile: File = this.convertBlobToFile(file)

      const filename = convertedFile.name
      const type = convertedFile.type

      const { signedUrl, url } = yield this.S3Sign(filename, type)

      yield this.putFileToS3(signedUrl!, convertedFile)

      const fileItem: FileItem = this.buildFileItem(convertedFile, url)

      const result: FileItem = yield this.postFile(fileItem)

      return result
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
