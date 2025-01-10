import { ISimDoc } from '../simDoc/types'
import { IViewport } from '../viewport/types'
import User from '../user'

export interface INote {
  _id: any
  viewport: IViewport | null
  logId: string
  text: string
  userId: string
  MNID: number
  reopenCount: number
  seq: number
  page?: string
  nonErrors?: NonError[]
  scorerCheck: ScorerCheck
  // simDoc: ISimDoc
  type: string
  complianceNote: any
  duration: number
  users?: User[]
  isDeleted?: boolean
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface INoteWithOrder extends INote {
  order?: number;
}

export class ScorerCheck {
  firstScorer!: boolean
  secondScorer!: boolean
}

export class NonError {
  _id!: string
  text!: string
  status!: NonErrorStatus
}

export enum NonErrorStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Pending = 'Pending',
  Final = 'Final',
}
