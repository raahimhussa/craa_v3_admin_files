import IAssessmentCycle, { Tutorials } from './assessmentCycle.interface'

import AssessmentCycleStore from 'src/stores/assessmentCycleStore'
import Model from '../model'
import { makeObservable } from 'mobx'

export class AssessmentCycle
  extends Model<IAssessmentCycle, AssessmentCycleStore>
  implements IAssessmentCycle
{
  _id: any = null
  name: string = ''
  tutorials: Tutorials = new Tutorials()
  assessmentTypeIds: string[] = []
  startDate!: Date
  endDate!: Date
  bypass!: boolean
  isDeleted!: boolean
  createdAt!: Date
  updatedAt!: Date

  constructor(store: AssessmentCycleStore, data: IAssessmentCycle) {
    super(store, data)
    makeObservable(this, {})
  }
}
