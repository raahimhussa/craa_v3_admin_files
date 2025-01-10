import { PageProgresses, Summary } from './types'

import { IModel } from '../types'
import { TrainingStatus } from 'src/utils/status'
import { makeAutoObservable } from 'mobx'

export default class UserTraining implements IModel {
  _id: string = ''
  userId: string = ''
  assessmentCycleId: string = ''
  assessmentTypeId: string = ''
  trainingId: string = ''
  domainId: string = ''
  usageTime: number = 0
  status: TrainingStatus = TrainingStatus.HasNotAssigned
  progresses?: PageProgresses = {}
  summary: Summary = {
    allPages: [],
    completePages: [],
    videoTime: 0,
    videoWatchingTime: 0,
    quizScore: 0,
    screenTime: 0,
  }
  isDeleted: boolean = false
  startedAt: Date = new Date()
  completedAt: Date = new Date()
  assignedAt: Date = new Date()
  createdAt: Date = new Date()
  updatedAt: Date = new Date()

  constructor() {
    makeAutoObservable(this, {
      _id: false,
    })
  }

  load(data: any) {
    Object.assign(this, data)
  }
}
