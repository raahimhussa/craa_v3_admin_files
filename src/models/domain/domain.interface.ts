export default interface IDomain {
  _id?: any
  visibleId?: number
  followupNumber?: number
  seq: number
  name: string
  isDeleted?: boolean
  parentId: string
  depth: number
  createdAt?: Date
  updatedAt?: Date
  remediable?: boolean
}
