import { DocumentType } from 'src/utils/status'
import DocumentPage from '../documentPage'

export interface IDocument {
  _id?: any
  title: string
  versions: any[]
  // versions: {}
  groupId: string
  isDeleted?: boolean
  isActivated?: boolean
  createdAt?: number
  updatedAt?: number
}
