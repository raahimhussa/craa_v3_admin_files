import { AnnouncementTemplate } from '.'

type ISimulation = {
  _id: string | null
  visibleId: number
  name: string
  label: string
  folderIds: string[]
  agreement: AnnouncementTemplate
  onSubmission: AnnouncementTemplate
  isDeleted?: boolean
  updatedAt?: Date
  createdAt?: Date
}

export default ISimulation
