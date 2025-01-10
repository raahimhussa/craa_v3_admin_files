import axios, { AxiosResponse } from 'axios'

import { Utils } from '@utils'
import { useRootStore } from 'src/stores'
import { useSWRConfig } from 'swr'

export const useUploadPopup = () => {
  const {
    uiState: { uploading },
  } = useRootStore()
  const { cache, mutate } = useSWRConfig()

  const postFile = async (fileItems: (FileItem | null)[]) => {
    let result = null
    try {
      const res: AxiosResponse = await axios.post(
        'v3/pdfFileManagement',
        fileItems.filter((_) => _)
      )
      result = res.data
      uploading.update(fileItems.map((_fi) => _fi?.modifiedPath || ''))
      Utils.matchMutate(cache, mutate, 'v3/pdfFileManagement')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
    return result
  }

  const updateFile = async (fileItems: (FileItem | null)[], fileId: string) => {
    let result = null
    try {
      const res: AxiosResponse = await axios.patch('v3/pdfFileManagement', {
        filter: { _id: fileId },
        update: fileItems.filter((_) => _),
      })
      result = res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
    return result
  }

  const upload = async (fileItems: (FileItem | null)[], fileId?: string) => {
    if (fileId) return await updateFile(fileItems, fileId)
    else return await postFile(fileItems)
  }

  const putFileToS3 = async (signedUrl: string, file: File) => {
    try {
      await axios.put(signedUrl, file)
    } catch (error) {
      console.error(error)
    }
  }

  const S3Sign = async (filename: string, type: string) => {
    let result: FileItem | null = null
    const file = {
      name: filename,
      type: type,
    }

    try {
      const res: AxiosResponse = await axios.post('v1/files/sign', file)
      result = res.data

      return result
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
      throw error
    }
  }

  const getSingleUploadFile = async (file: File | Blob) => {
    try {
      const convertedFile: File = convertBlobToFile(file)

      const filename = convertedFile.name
      const type = convertedFile.type
      const modifiedPath = (convertedFile as any).modifiedPath

      uploading.add({
        mimeType: type,
        fileName: filename,
        uploaded: false,
        url: modifiedPath,
      })
      uploading.open()

      const signedFileItem = await S3Sign(filename, type)

      if (!signedFileItem) return null

      const { signedUrl, url } = signedFileItem

      if (!signedUrl || !url) return null

      await putFileToS3(signedUrl, convertedFile)

      const fileItem: FileItem = buildFileItem(convertedFile, url)

      return await upload([fileItem])
    } catch (error) {
      throw error
    }
  }

  const multiUpload = (files: FileList) => {}

  const buildFileItem = (file: File, url: string) => {
    const fileItem: FileItem = {
      name: file.name,
      mimeType: file.type,
      size: file.size,
      url: url,
      path: (file as any).modifiedPath,
    }
    return fileItem
  }

  const convertBlobToFile = (file: File | Blob): File => {
    if (file instanceof File) {
      return file
    }
    const filename = String(Math.floor(Math.random() * 90000) + 10000)

    const _file: File = new File([file], filename, { type: file.type })

    return _file
  }

  return {
    postFile,
    updateFile,
    upload,
    S3Sign,
    getSingleUploadFile,
    multiUpload,
    buildFileItem,
    convertBlobToFile,
  }
}

export type FileItem = {
  index?: number
  name: string
  size?: number
  mimeType: string
  url?: string
  signedUrl?: string
  path?: string
  modifiedPath?: string
}
