export interface IDocumentVariable {
  _id?: any
  key: string
  value: string
  groupId: string
  // versions: {}
  isDeleted?: boolean
  createdAt?: number
  updatedAt?: number
}
