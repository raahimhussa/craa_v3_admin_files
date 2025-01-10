import { makeAutoObservable, observable } from 'mobx'

import AdminLayout from './layouts/adminLayout'
import Agreements from './pages/agreements'
import Alert from './components/alert'
import Answer from './components/answer'
import Assessment from './pages/assessment'
import AssessmentCycles from './pages/assessmentCycles'
import AssessmentTypes from './pages/assessmentTypes'
import Assessments from './pages/assessments'
import ClientUnits from './pages/clientUnits'
import DetailLayout from './layouts/detailLayout'
import Docs from './pages/docs'
import Domains from './pages/domains'
import Files from './pages/files'
import Findings from './pages/findings'
import KeyConcepts from './pages/keyConcepts'
import Modal from './modal'
import PdfViewType from './pdfViewType'
import { RootStore } from '../root'
import Scorings from './pages/scorings'
import ScreenRecords from './pages/screenRecords'
import Simulations from './pages/simulations'
import Templates from './pages/templates'
import Uploading from './uploading'
import UserAssessmentCycles from './pages/userAssessmentCycles'
import UserSimulation from './pages/userSimulation'
import Users from './pages/users'
import Documents from './pages/documents'
import DocumentVariables from './pages/documentVariables'

export default class UiState {
  language = 'en_US'
  pendingRequestCount = 0
  windowDimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  online = true
  rootStore: RootStore
  form: any
  delete: any

  modal: Modal
  uploading: Uploading
  pdfViewType: PdfViewType
  detailLayout: DetailLayout
  adminLayout: AdminLayout
  clientUnits: ClientUnits
  files: Files
  alert: Alert
  simulations: Simulations
  keyConcepts: KeyConcepts
  assessmentTypes: AssessmentTypes
  assessment: Assessment
  assessmentCycles: AssessmentCycles
  screenRecords: ScreenRecords
  agreements: Agreements
  templates: Templates
  domains: Domains
  docs: Docs
  users: Users
  findings: Findings
  assessments: Assessments
  scorings: Scorings
  answer: Answer
  userAssessmentCycles: UserAssessmentCycles
  userSimulation: UserSimulation
  documents: Documents
  documentVariables: DocumentVariables
  // assessments: Assessments

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.modal = new Modal(this)
    this.uploading = new Uploading(this)
    this.pdfViewType = new PdfViewType(this)
    this.detailLayout = new DetailLayout(this)
    this.adminLayout = new AdminLayout(this)

    this.userSimulation = new UserSimulation(this)
    this.userSimulation = new UserSimulation(this)
    this.userAssessmentCycles = new UserAssessmentCycles(this)
    this.clientUnits = new ClientUnits(this)
    this.files = new Files(this)
    this.simulations = new Simulations(this)
    this.keyConcepts = new KeyConcepts(this)
    this.assessmentTypes = new AssessmentTypes(this)
    this.assessmentCycles = new AssessmentCycles(this)
    this.screenRecords = new ScreenRecords(this)
    this.agreements = new Agreements(this)
    this.templates = new Templates(this)
    this.alert = new Alert(this)
    this.domains = new Domains(this)
    this.docs = new Docs(this)
    this.users = new Users(this)
    this.findings = new Findings(this)
    this.assessments = new Assessments(this)
    this.assessment = new Assessment(this)
    this.scorings = new Scorings(this)
    this.answer = new Answer(this)
    this.documents = new Documents(this)
    this.documentVariables = new DocumentVariables(this)
    makeAutoObservable(this, {
      windowDimensions: observable.struct,
      rootStore: false,
    })
    window.onresize = () => {
      this.windowDimensions = this.getWindowDimensions()
    }
  }

  get appIsInSync() {
    return this.pendingRequestCount === 0
  }

  getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height,
    }
  }
}
