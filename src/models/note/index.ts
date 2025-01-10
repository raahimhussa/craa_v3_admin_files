import { INote, NonError, ScorerCheck } from './note.interface'

import { IModel } from '../types'
import NoteStore from 'src/stores/noteStore'
import Viewport from '../viewport'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'

export default class Note implements IModel, INote {
  _id: any = null
  viewport: Viewport | null = null
  logId: string = ''
  text: string = ''
  userId: string = ''
  duration: number = 0
  complianceNote: any = ''
  type: string = ''
  MNID: number = 0
  reopenCount: number = 0
  seq: number = 0
  nonErrors?: NonError[]
  scorerCheck: ScorerCheck = { firstScorer: false, secondScorer: false }
  isDeleted: boolean = false
  createdAt: Date | null = null
  updatedAt: Date | null = null

  store: NoteStore | null
  constructor(store: NoteStore) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
      userId: false,
    })
  }

  load(data: any) {
    Object.assign(this, data)
  }

  *save() {
    const _note: Note = _.cloneDeep(this)
    _note.store = null
    try {
      yield this.store?.repository.update({
        filter: { _id: _note._id },
        update: _note,
      })
    } catch (error) {
      console.error(error)
    }
  }

  *delete() {
    alert('delete')
  }

  setText(value: string) {
    this.text = value
  }
}
