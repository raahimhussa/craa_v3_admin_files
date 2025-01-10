import { makeObservable, observable } from 'mobx'

import AnswerRepository from 'src/repos/v2/answer'
import { AnswerStatus } from 'src/utils/status'
import { AssessmentScorerType } from '../ui/pages/assessment'
import IAnswer from 'src/models/answer/answer.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { RootStore } from '../root'
import Store from '../store'
import _ from 'lodash'

export default class AnswerStore extends Store<IAnswer> {
  form: IAnswer & Identifiable = {
    _id: null,
    assessmentId: '',
    simDocId: '',
    findingId: '',
    scoring: {
      firstScorer: {
        scorerId: '',
        noteId: null,
        answerStatus: AnswerStatus.NotScored,
        updatedAt: new Date(),
      },
      secondScorer: {
        scorerId: '',
        noteId: null,
        answerStatus: AnswerStatus.NotScored,
        updatedAt: new Date(),
      },
      adjudicator: {
        scorerId: '',
        noteId: null,
        answerStatus: AnswerStatus.NotScored,
        updatedAt: new Date(),
      },
    },
  }
  answers: IAnswer[] = []
  defaultForm: IAnswer & Identifiable = _.cloneDeep(this.form)

  constructor(store: RootStore, repository: AnswerRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }

  async markAsCorrect(answerId: string, scorerType: AssessmentScorerType) {
    if (scorerType === AssessmentScorerType.Adjudicator) {
      this.answers = [...this.answers].map((_answer) => {
        if (_answer._id === answerId) {
          _answer.scoring[scorerType].answerStatus = AnswerStatus.Correct
        }
        return _answer
      })
      return this.repository.update({
        filter: {
          _id: answerId,
        },
        update: {
          $set: {
            [`scoring.${scorerType}.answerStatus`]: AnswerStatus.Correct,
            [`scoring.${scorerType}.updatedAt`]: new Date(),
          },
          // status: AnswerStatus.Correct,
        },
      })
    } else {
      this.answers = [...this.answers].map((_answer) => {
        if (_answer._id === answerId) {
          _answer.scoring[scorerType].answerStatus = AnswerStatus.Correct
        }
        return _answer
      })
      return this.repository.update({
        filter: {
          _id: answerId,
        },
        update: {
          $set: {
            [`scoring.${AssessmentScorerType.Adjudicator}.answerStatus`]:
              AnswerStatus.NotScored,
            [`scoring.${AssessmentScorerType.Adjudicator}.updatedAt`]:
              new Date(),
            [`scoring.${scorerType}.answerStatus`]: AnswerStatus.Correct,
            [`scoring.${scorerType}.updatedAt`]: new Date(),
          },
          // status: AnswerStatus.Correct,
        },
      })
    }
  }

  async markAsIncorrect(answerId: string, scorerType: AssessmentScorerType) {
    if (scorerType === AssessmentScorerType.Adjudicator) {
      this.answers = [...this.answers].map((_answer) => {
        if (_answer._id === answerId) {
          _answer.scoring[scorerType].answerStatus = AnswerStatus.InCorrect
          _answer.scoring[scorerType].noteId = null
        }
        return _answer
      })
      return this.repository.update({
        filter: {
          _id: answerId,
        },
        update: {
          $set: {
            [`scoring.${scorerType}.answerStatus`]: AnswerStatus.InCorrect,
            [`scoring.${scorerType}.noteId`]: null,
            [`scoring.${scorerType}.updatedAt`]: new Date(),
          },
          // status: AnswerStatus.InCorrect,
        },
      })
    } else {
      this.answers = [...this.answers].map((_answer) => {
        if (_answer._id === answerId) {
          _answer.scoring[scorerType].answerStatus = AnswerStatus.InCorrect
          _answer.scoring[scorerType].noteId = null
        }
        return _answer
      })
      return this.repository.update({
        filter: {
          _id: answerId,
        },
        update: {
          $set: {
            [`scoring.${AssessmentScorerType.Adjudicator}.answerStatus`]:
              AnswerStatus.NotScored,
            [`scoring.${AssessmentScorerType.Adjudicator}.noteId`]: null,
            [`scoring.${AssessmentScorerType.Adjudicator}.updatedAt`]:
              new Date(),
            [`scoring.${scorerType}.answerStatus`]: AnswerStatus.InCorrect,
            [`scoring.${scorerType}.noteId`]: null,
            [`scoring.${scorerType}.updatedAt`]: new Date(),
          },
          // status: AnswerStatus.InCorrect,
        },
      })
    }
  }

  async connectNoteIdToAnswer(
    answerId: string,
    noteId: string | null,
    scorerType: AssessmentScorerType
  ) {
    if (scorerType === AssessmentScorerType.Adjudicator) {
      this.answers = [...this.answers].map((_answer) => {
        if (_answer._id === answerId) {
          _answer.scoring[scorerType].noteId = noteId
        }
        return _answer
      })
      return await this.repository.update({
        filter: {
          _id: answerId,
        },
        update: {
          $set: {
            [`scoring.${scorerType}.noteId`]: noteId,
            [`scoring.${scorerType}.updatedAt`]: new Date(),
          },
          // noteId: noteId,
        },
      })
    } else {
      this.answers = [...this.answers].map((_answer) => {
        if (_answer._id === answerId) {
          _answer.scoring[scorerType].noteId = noteId
        }
        return _answer
      })
      return await this.repository.update({
        filter: {
          _id: answerId,
        },
        update: {
          $set: {
            [`scoring.${AssessmentScorerType.Adjudicator}.noteId`]: null,
            [`scoring.${AssessmentScorerType.Adjudicator}.updatedAt`]:
              new Date(),
            [`scoring.${scorerType}.noteId`]: noteId,
            [`scoring.${scorerType}.updatedAt`]: new Date(),
          },
          // noteId: noteId,
        },
      })
    }
  }

  notReadyToSubmitCount(scorerType: AssessmentScorerType) {
    let count = 0
    if (scorerType === AssessmentScorerType.Adjudicator) {
      this.answers?.forEach((_answer) => {
        const firstScoring = _answer.scoring.firstScorer
        const secondScoring = _answer.scoring.secondScorer
        const adjudicateScoring = _answer.scoring.adjudicator

        if (adjudicateScoring.answerStatus === AnswerStatus.NotScored) {
          const isNeedToAdjudicate =
            firstScoring.answerStatus !== secondScoring.answerStatus ||
            firstScoring.noteId !== secondScoring.noteId

          const correctCondition = isNeedToAdjudicate
            ? false
            : firstScoring.answerStatus === AnswerStatus.Correct
          const incorrectCondition = isNeedToAdjudicate
            ? false
            : firstScoring.answerStatus === AnswerStatus.InCorrect

          if (correctCondition || incorrectCondition) return
          count++
        } else {
          const correctCondition =
            adjudicateScoring.answerStatus === AnswerStatus.Correct &&
            adjudicateScoring.noteId
          const incorrectCondition =
            adjudicateScoring.answerStatus === AnswerStatus.InCorrect
          if (correctCondition || incorrectCondition) return
          count++
        }
      })
    } else {
      this.answers?.forEach((_answer) => {
        const scoring = _answer.scoring[scorerType]
        const correctCondition =
          scoring.answerStatus === AnswerStatus.Correct && scoring.noteId
        const incorrectCondition =
          scoring.answerStatus === AnswerStatus.InCorrect
        if (correctCondition || incorrectCondition) return
        count++
      })
    }
    return count
  }
}
