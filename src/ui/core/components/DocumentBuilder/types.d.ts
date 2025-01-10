export type FileData = Array<FileItem>

export type FileItem = {
  index: number
  name: string
  size: number
  mimeType: string
  url?: string
  signedUrl?: string
}

export type UploaderProps = {
  fileId?: string
  state?: object
  path?: string
}

export type LocalState = {
  value: FileItem[]
  files: File[]
  isLoading: boolean
}
