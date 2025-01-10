export default interface IRole {
  readonly _id?: any
  title: string
  priority: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}
