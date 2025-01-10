export default interface IFolder {
  _id: any
  name: string
  depth: number
  expanded: boolean
  folderId: string | null
  isActivated: boolean
  isDeleted?: boolean
  createdAt?: Date | null
  updatedAt?: Date | null
  label: string
}
