import axios, { AxiosResponse } from 'axios'

import { FileItem } from './types'

export const postFile = async (fileItems: (FileItem | null)[]) => {
  let result = null
  try {
    const res: AxiosResponse = await axios.post(
      'v3/pdfFileManagement',
      fileItems.filter((_) => _)
    )
    result = res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response)
    }
  }
  return result
}

export const updateFile = async (
  fileItems: (FileItem | null)[],
  fileId: string
) => {
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

export const upload = async (
  fileItems: (FileItem | null)[],
  fileId?: string
) => {
  if (fileId) return await updateFile(fileItems, fileId)
  else return await postFile(fileItems)
}

export const putFileToS3 = async (signedUrl: string, file: File) => {
  try {
    await axios.put(signedUrl, file)
  } catch (error) {
    console.error(error)
  }
}

export const S3Sign = async (filename: string, type: string) => {
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

export const getSingleUploadFile = async (file: File | Blob) => {
  try {
    const convertedFile: File = convertBlobToFile(file)

    const filename = convertedFile.name
    const type = convertedFile.type

    const signedFileItem = await S3Sign(filename, type)

    if (!signedFileItem) return null

    const { signedUrl, url } = signedFileItem

    if (!signedUrl || !url) return null

    await putFileToS3(signedUrl, convertedFile)

    const fileItem: FileItem = buildFileItem(convertedFile, url)

    return fileItem
  } catch (error) {
    throw error
  }
}

export const multiUpload = (files: FileList) => {}

export const buildFileItem = (file: File, url: string) => {
  const fileItem: FileItem = {
    name: file.name,
    mimeType: file.type,
    size: file.size,
    url: url,
    path: (file as any).path
      .split('/')
      .filter((_: any) => !!_)
      .join('/'),
  }
  return fileItem
}

export const convertBlobToFile = (file: File | Blob): File => {
  if (file instanceof File) {
    return file
  }
  const filename = String(Math.floor(Math.random() * 90000) + 10000)

  const _file: File = new File([file], filename, { type: file.type })

  return _file
}
