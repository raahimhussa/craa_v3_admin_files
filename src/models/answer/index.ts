import IAnswer, { Scoring } from './answer.interface'

import AnswerStore from 'src/stores/answerStore'
import findingInterface from '../finding/finding.interface'
import { makeAutoObservable } from 'mobx'

export default class Answer implements IAnswer {
  _id?: any
  store: AnswerStore
  assessmentId!: string
  // noteId!: string
  simDocId!: string
  // status!: AnswerStatus
  findingId!: string
  isDeleted?: boolean | undefined
  scoring!: Scoring
  createdAt?: Date | undefined
  updatedAt?: Date | undefined

  constructor(store: AnswerStore, data: IAnswer) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }
  finding?: findingInterface | undefined
}
