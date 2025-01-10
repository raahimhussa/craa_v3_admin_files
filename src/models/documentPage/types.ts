import { DocumentType } from 'src/utils/status'

export interface IDocumentPage {
  _id?: any
  content: string
  order: number
  isDeleted?: boolean
  createdAt?: number
  updatedAt?: number
}
