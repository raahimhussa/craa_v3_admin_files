import { action, makeObservable, observable } from 'mobx'

import { IAssessment } from 'src/models/assessment/assessment.interface'
import IUser from 'src/models/user/user.interface'
import UIStore from '../uiStore'
import UiState from '..'
import _ from 'lodash'

export enum AssessmentScorerType {
  Adjudicator = 'adjudicator',
  FirstScorer = 'firstScorer',
  SecondScorer = 'secondScorer',
}

export default class Assessment extends UIStore {
  scorerType = AssessmentScorerType.FirstScorer
  constructor(uiState: UiState) {
    super(uiState)
    makeObservable(this, {
      _mutate: false,
      scorerType: observable,
      setScorerType: action,
    })
  }

  setScorerType(assessment: IAssessment, userId: string) {
    if (assessment.firstScorer._id === userId) {
      this.scorerType = AssessmentScorerType.FirstScorer
    } else if (assessment.secondScorer._id === userId) {
      this.scorerType = AssessmentScorerType.SecondScorer
    } else if (assessment.adjudicator._id === userId) {
      this.scorerType = AssessmentScorerType.Adjudicator
    }
  }
}
