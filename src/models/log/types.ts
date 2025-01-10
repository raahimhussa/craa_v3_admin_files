import IBookmark from '../bookmark/types'
import { INote } from '../note/note.interface'

export enum LogScreen {
  Baseline = 'baseline',
  Followups = 'followups',
  Trainings = 'trainings',
  AssessmentCycles = 'assessmentCycles',
  AssessmentCycle = 'assessmentCycle',
  SignIn = 'signIn',
  SignUp = 'signUp',
  Bookmark = 'boomark',
}

export enum SimEvent {
  // complete
  OnClickStart = 'start',
  // complete
  OnClickSubmit = 'submit',
  // complete
  Review = 'review',
  // complete
  OnClickAddViewport = 'addViewport',
  // complete
  AddBookmark = 'addBookmark',
  ToggleCalendar = 'calendar',
  OnClickSignIn = 'signin',
  OnClickSignUp = 'signup',
  OnClickLogout = 'logout',
  OnClickAddNote = 'addNote',
  OnClickNextPage = 'pdfNext',
  OnClickPrevPage = 'pdfPrev',
  SearchPDFPage = 'searchPDFPage',
  OnClickScaleUp = 'pdfScaleUp',
  OnClickScaleDown = 'pdfScaleDown',
  OnClickFullScreen = 'fullScreen',
  onClickSave = 'saveNote',
  onClickDelete = 'deleteNote',
}

export enum Severity {
  Success = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}

export default interface ILog {
  _id: any
  screen: LogScreen
  event: SimEvent
  severity: Severity
  duration: number
  baselineId?: string
  message: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
  note?: INote | null
  userSimulationId?: any
  userId: any
  viewports?: any[]
  bookmark?: IBookmark
  recordId: string
}
