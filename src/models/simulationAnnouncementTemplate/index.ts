import { SimulationAnnouncementTemplateType } from 'src/utils/status'

export default class SimulationAnnouncementTemplate {
  readonly _id?: any

  kind!: SimulationAnnouncementTemplateType
  name!: string
  htmlContent!: string
  isDeleted!: boolean
  createdAt?: Date
  updatedAt?: Date
}
