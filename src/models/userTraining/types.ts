import { TrainingStatus } from 'src/utils/status'

export type PageProgresses = {
  [pageId: string]: PageProgress
}

export type PageProgress = {
  pageId: string
  status: TrainingStatus
  quizAnswers: QuizAnswers
  videoTime: number
  videoWatchingTime: number
  quizScore: number
  screenTime: number
  totalScore: number
}

export type Summary = {
  allPages: string[]
  completePages: string[]
  videoTime: number
  videoWatchingTime: number
  quizScore: number
  screenTime: number
}

type QuizAnswers = {
  [quizId: string]: QuizAnswer
}

type QuizAnswer = {
  quizId: string
  answers: string[]
}
