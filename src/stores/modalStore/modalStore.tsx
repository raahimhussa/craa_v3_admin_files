import Bookmark from '../modals/bookmark'
import Client from 'src/ui/pages/admin/Client/Client'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import { makeAutoObservable } from 'mobx'

type Modal = {
  children?: any
  isVisible: boolean
  payload?: any
  isEditMode?: boolean
}

type FolderModal = Modal & {
  payload: {
    folder?: any
  }
}

export default class ModalStore {
  bookmark: Bookmark
  store: RootStore
  router: RouterStore
  form: any
  delete: any

  exam: Modal = {
    isVisible: false,
  }

  file: Modal = {
    isVisible: false,
  }

  documents: Modal = {
    isVisible: false,
    payload: {
      files: [],
    },
  }

  userSimulation: Modal = {
    isVisible: false,
    payload: {
      userSimulation: [],
    },
  }

  fileSelect: Modal & {
    onClickSelect?: any
  } = {
    isVisible: false,
    payload: {
      add: (files: any[]) => console.log('pass handler'),
      row: null,
    },
  }

  loading: Modal = {
    isVisible: false,
  }

  folder: FolderModal = {
    isVisible: false,
    payload: {
      folder: null,
    },
  }

  businessUnit: Modal = {
    isVisible: false,
    payload: {
      client: null,
      row: null,
    },
  }

  log: Modal = {
    isVisible: false,
    payload: {
      row: null,
      rowId: null,
    },
  }

  instruction: Modal = {
    isVisible: false,
    isEditMode: false,
    payload: {
      row: null,
    },
  }

  uploader: Modal = {
    isVisible: false,
  }

  simDoc: Modal = {
    isVisible: false,
    isEditMode: false,
    payload: {
      row: null,
    },
  }

  studyDocument: Modal = {
    isVisible: false,
    isEditMode: false,
    payload: {
      row: null,
    },
  }

  category: Modal = {
    isVisible: false,
    isEditMode: false,
    payload: {
      row: null,
    },
  }

  categoryItem: Modal = {
    isVisible: false,
    isEditMode: false,
    payload: {
      categoryItem: null,
    },
  }

  protocol: Modal = {
    isEditMode: false,
    isVisible: false,
    payload: {
      row: null,
    },
  }

  agreement: Modal = {
    isEditMode: false,
    isVisible: false,
    payload: {
      row: null,
    },
  }

  assessmentType: Modal = {
    isEditMode: false,
    isVisible: false,
    payload: {
      row: null,
    },
  }

  template: Modal = {
    isEditMode: false,
    isVisible: false,
    payload: {
      row: null,
    },
  }

  keyConcept: Modal = {
    isEditMode: false,
    isVisible: false,
    payload: {
      row: null,
    },
  }

  password: Modal = {
    isVisible: false,
    payload: {
      rowId: null,
    },
  }

  policy: Modal = {
    isEditMode: false,
    isVisible: false,
    payload: {
      row: null,
    },
  }

  domain: Modal = {
    isEditMode: false,
    isVisible: false,
    payload: {
      row: null,
    },
  }

  client: Modal = {
    isVisible: false,
    children: <Client />,
    payload: {
      rowId: null,
      client: null,
      row: null,
    },
  }

  role: Modal = {
    isVisible: false,
  }

  training: Modal = {
    isVisible: false,
  }

  trainingModule: Modal = {
    isVisible: false,
  }

  simulation: Modal = {
    isVisible: false,
    isEditMode: false,
    payload: {
      row: null,
    },
  }

  assignTraining: Modal = {
    isVisible: false,
  }

  assessment: Modal = {
    isVisible: false,
  }

  assessmentCycle: Modal = {
    isVisible: false,
    payload: {
      row: null,
    },
  }

  videoPlayer: Modal & {
    trainingRoom: any
    type: string
  } = {
    type: 'screenRecord',
    isVisible: false,
    trainingRoom: null,
  }

  isVisible: boolean = false

  constructor(store: RootStore) {
    this.store = store
    this.router = store.routerStore
    this.bookmark = new Bookmark()
    makeAutoObservable(this)
  }

  open() {
    this.isVisible = true
  }

  close() {
    this.isVisible = false
  }

  reset(kind: string) {
    eval(`this.${kind}.isVisible = false`)
    eval(`this.${kind}.isEditMode = false`)
    eval(`this.${kind}.payload = {}`)
  }
}
