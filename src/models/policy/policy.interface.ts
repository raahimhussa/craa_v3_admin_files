export default interface IKeyConcept {
  _id?: any
  label: string
  allowedPages: string[]
  allowedActions: string[]
  // domainId: string
  // description: string
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}
