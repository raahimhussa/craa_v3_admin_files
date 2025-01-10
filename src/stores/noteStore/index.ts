import { FormMode, IStore } from '../types'
import { INote, NonErrorStatus, INoteWithOrder } from 'src/models/note/note.interface'
import { makeAutoObservable, toJS } from 'mobx'

import { AssessmentScorerType } from '../ui/pages/assessment'
import { IViewport } from 'src/models/viewport/types'
import { Mode } from './types'
import Note from 'src/models/note'
import NoteRepository from 'src/repos/v2/note'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import _ from 'lodash'

export default class NoteStore implements IStore {
  rootStore: RootStore
  router: RouterStore
  repository: NoteRepository
  // notes: INote[] | null = null
  notes: INoteWithOrder[] | null = null // to handle cases where 'order' is provided
  searchText: string = ''
  noteMode: Mode = Mode.Mini
  form: INote = {
    _id: null,
    viewport: null,
    logId: '',
    text: '',
    userId: '',
    duration: 0,
    complianceNote: '',
    type: '',
    MNID: 0,
    reopenCount: 0,
    seq: 0,
    scorerCheck: {
      firstScorer: false,
      secondScorer: false,
    },
  }
  delete: any

  constructor(rootStore: RootStore, repository: NoteRepository) {
    this.rootStore = rootStore
    this.router = rootStore.routerStore
    this.repository = repository
    makeAutoObservable(this, {
      rootStore: false,
    })
  }
  mode: FormMode = FormMode.New
  mutate: any

  loadData(data: Note[]) {
    this.notes = data.map((data) => {
      const note = new Note(this)
      note.load(data)
      return note
    })
  }

  notesFilteredBySearchText() {
    const regExp = new RegExp(this.searchText, 'i')

    return this.notes?.filter((note: INote) => regExp.test(note.text))
  }

  *addNote() {
    const note = toJS(this.form)
    note.userId = this.rootStore.authStore.user._id
    const viewport = toJS(this.rootStore.viewportStore.getActiveViewport())

    viewport!.store = null
    note.viewport = viewport as IViewport
    try {
      yield this.repository.create(note)
    } catch (error) {
      console.log(error)
    }

    this.form.text = ''
    this.notes?.unshift(note)
  }

  notReadyToSubmitCount(scorerType: string) {
    let count = 0
    this.notes?.forEach((_note) => {
      if (
        (scorerType === AssessmentScorerType.FirstScorer ||
          scorerType === AssessmentScorerType.SecondScorer) &&
        !_note.scorerCheck[scorerType]
      ) {
        count++
      }
    })
    return count
  }

  unhandledNonErrorCount(scorerType: string, scorerId: string) {
    let count = 0
    if (scorerType !== AssessmentScorerType.Adjudicator) return count
    this.notes?.forEach((_note) => {
      if (!_note.nonErrors || _note.nonErrors.length === 0) return
      if (_note.nonErrors.find((_nonError) => _nonError._id === scorerId))
        return
      count++
    })
    return count
  }
}
