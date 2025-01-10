import { DocumentType } from 'src/utils/status'

export interface ISimDoc {
  _id?: any
  visibleId: number
  kind: DocumentType
  title: string
  seq?: number
  files: any[]
  numberOfPillsToShow: number
  numberOfPillsTakenBySubject: number
  numberOfPillsPrescribed: number

  documentId: string | null

  folderId: string | null

  expanded?: boolean
  isActivated: boolean

  totalPage: number
  currentPage: number
  scale: number

  isDeleted?: boolean
  createdAt?: number
  updatedAt?: number

  label: string
}
