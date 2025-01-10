import { ISimDoc } from '../simDoc/types'

export interface IViewport {
  _id: any
  active: boolean
  index: number
  userId: string
  simulationId: string
  userSimulationId: string
  simDoc: ISimDoc | null
  viewedSimDocIds: Array<number>
  isDeleted: boolean
  isMounted: boolean
  createdAt: number
  updatedAt: number
}
