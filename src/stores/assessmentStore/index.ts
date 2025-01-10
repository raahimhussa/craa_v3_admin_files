import {
  AdminLogScreen,
  AssessmentStatus,
  ScorerStatus,
} from 'src/utils/status'
import { makeObservable, observable } from 'mobx'

import { AdminLogManager } from 'src/classes/adminLogManager'
import AssessmentRepository from 'src/repos/v2/assessment'
import { AssessmentScorerType } from '../ui/pages/assessment'
import CommonDAO from 'src/commons/interfaces/commonDAO.interface'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { RootStore } from '../root'
import Store from '../store'
import _ from 'lodash'
import axios from 'axios'

export default class AssessmentStore extends Store<IAssessment> {
  form: IAssessment = {
    _id: null,
    userSimulationId: '',
    isExpedited: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    firstScorer: {
      _id: '',
      status: ScorerStatus.HasNotStarted,
      scoringTime: 0,
    },
    secondScorer: {
      _id: '',
      status: ScorerStatus.HasNotStarted,
      scoringTime: 0,
    },
    adjudicator: {
      _id: '',
      status: ScorerStatus.HasNotStarted,
    },
    status: '',
    publishedAt: null,
    userAssessmentCycle: undefined,
  }
  readyToSubmitByAnswer = {} as { [key: string]: boolean }
  showValidationScoring = false
  showScoringBoard = true

  defaultForm: IAssessment = _.cloneDeep(this.form)
  constructor(store: RootStore, repository: AssessmentRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
      readyToSubmitByAnswer: observable,
      showValidationScoring: observable,
      showScoringBoard: observable,
    })
  }

  async submitScoring(assessment: IAssessment) {
    const adminLogManager = AdminLogManager.getInstance()
    const isFirstScorer =
      this.rootStore.authStore.user._id === assessment.firstScorer._id

    const isSecondScorer =
      this.rootStore.authStore.user._id === assessment.secondScorer._id

    if (isFirstScorer) {
      await axios.patch(
        `v3/scoringManagement/assessments/${assessment._id}/firstScorer/scoring`
      )
      await adminLogManager?.createScoringLog({
        screen: AdminLogScreen.Scoring,
        target: {
          type: 'assessments',
          _id: assessment._id,
          scorerId: assessment.firstScorer._id,
          message: 'submit first scorer scoring',
        },
      })
    }
    if (isSecondScorer) {
      await axios.patch(
        `v3/scoringManagement/assessments/${assessment._id}/secondScorer/scoring`
      )
      await adminLogManager?.createScoringLog({
        screen: AdminLogScreen.Scoring,
        target: {
          type: 'assessments',
          _id: assessment._id,
          scorerId: assessment.secondScorer._id,
          message: 'submit second scorer scoring',
        },
      })
    }
  }

  async submitAdjudicate(assessment: IAssessment) {
    const adminLogManager = AdminLogManager.getInstance()
    const isAdjudicator =
      this.rootStore.authStore.user._id === assessment.adjudicator._id

    if (isAdjudicator) {
      await axios.patch(
        `v3/scoringManagement/assessments/${assessment._id}/adjudicator/scoring`
      )
    }
    adminLogManager?.createAdjudicatingLog({
      screen: AdminLogScreen.Scoring,
      target: {
        type: 'assessments',
        _id: assessment._id,
        scorerId: assessment.adjudicator._id,
        message: 'submit adjudicating',
      },
    })
  }

  async scoreResult(assessment: IAssessment) {
    try {
      await axios.patch(`v2/assessments/${assessment._id}/preview`)
    } catch (error) {
      throw error
    }
  }

  async changeStatus(
    assessmentId: string,
    type: AssessmentScorerType,
    status: ScorerStatus
  ) {
    const update = {
      $set: { [`${type}.status`]: status },
    }
    return this.repository.update({
      filter: {
        _id: assessmentId,
      },
      update,
    })
  }
}
