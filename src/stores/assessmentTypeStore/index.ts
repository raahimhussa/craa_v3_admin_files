import IAssessmentType, {
  ATBaseline,
} from 'src/models/assessmentType/assessmentType.interface'
import { makeObservable, observable } from 'mobx'

import AssessmentTypeRepository from 'src/repos/v1/assessmenType'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { RootStore } from '../root'
import Store from '../store'
import _ from 'lodash'

export default class AssessmentTypeStore extends Store<IAssessmentType> {
  form: IAssessmentType & Identifiable = {
    _id: null,
    label: '',
    baseline: {
      name: '',
      label: '',
      testTime: 0,
      minimumHour: 0,
      deadline: 0,
      simulationId: '',
      protocolIds: [],
      instructionIds: [],
      studyLogIds: [],
      riskManagementIds: [],
      attemptCount: 0,
    },
    followups: [],
    trainings: [],
    isDeleted: false,
    createdAt: undefined,
    updatedAt: undefined,
  }
  defaultForm: IAssessmentType & Identifiable = _.cloneDeep(this.form)
  constructor(store: RootStore, repository: AssessmentTypeRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
