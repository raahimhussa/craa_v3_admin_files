import AgreementRepository from 'src/repos/v1/agreementRepository'
import AgreementStore from './agreementStore'
import AnswerRepository from 'src/repos/v2/answer'
import AnswerStore from './answerStore'
import AssessmentCycleRepository from 'src/repos/v1/assessmentCycleRepository'
import AssessmentCycleStore from './assessmentCycleStore'
import AssessmentRepository from 'src/repos/v2/assessment'
import AssessmentStore from './assessmentStore'
import AssessmentTypeRepository from 'src/repos/v1/assessmenType'
import AssessmentTypeStore from './assessmentTypeStore'
import { AuthCodeRepository } from 'src/repos/v1/authCodeRepository'
import AuthStore from './authStore'
import BookmarkRepository from 'src/repos/v2/bookmark'
import BookmarkStore from './bookmarkStore'
import ClientUnitRepository from 'src/repos/v1/clientUnit'
import ClientUnitStore from './clientUnitStore'
import DialogStore from './dialogStore/dialogStore'
import DocRepository from 'src/repos/v1/docRepository'
import DocStore from './docStore'
import DomainRepository from 'src/repos/v2/domainRepository'
import DomainStore from './domainStore'
import FileRepository from 'src/repos/v1/file'
import FileStore from './fileStore'
import FindingRepository from 'src/repos/v2/findingRepository'
import FindingStore from './findingStore'
import FolderRepository from 'src/repos/v2/folderRepository'
import FolderStore from './folderStore'
import KeyConceptRepository from 'src/repos/v2/keyConceptRepository'
import KeyConceptStore from './keyConceptStore/KeyConceptStore'
import LogRepository from 'src/repos/v2/log'
import LogStore from './logStore'
import ModalStore from './modalStore/modalStore'
import NoteRepository from 'src/repos/v2/note'
import NoteStore from './noteStore'
import PolicyRepository from 'src/repos/v2/policyRepository'
import PolicyStore from './policyStore'
import RoleRepository from 'src/repos/v1/role'
import RoleStore from './roleStore'
import RouterStore from './routerStore'
import ScoringManagementStore from './socringManagementStore/scoringManagment'
import ScreenRecorderRepository from 'src/repos/v2/screenRecorder'
import ScreenRecorderStore from './screenRecorderStore'
import SettingRepository from 'src/repos/v2/setting'
import { SettingStore } from './settingStore'
import SimDocRepository from 'src/repos/v1/simDoc'
import SimDocStore from './simDocStore'
import SimulationRepository from 'src/repos/v1/simulation'
import SimulationStore from './simulationStore/SimulationStore'
import TemplateRepository from 'src/repos/v2/templateRepository'
import TemplateStore from './templateStore'
import UiState from './ui'
import UserAssessmentCycleRepository from 'src/repos/v2/userAssessmentCycleRepository'
import UserAssessmentCycleStore from './userAssessmentCycleStore'
import UserRepository from 'src/repos/v1/user'
import UserSimulationRepository from 'src/repos/v2/userSimulation'
import UserSimulationStore from './userSimulationStore'
import { UserStore } from './userStore'
import ViewportRepository from 'src/repos/v2/viewport'
import ViewportStore from './viewportStore'
import DocumentStore from './documentStore'
import DocumentPageStore from './documentPageStore'
import DocumentRepository from 'src/repos/v1/document'
import DocumentPageRepository from 'src/repos/v1/documentPage'
import DocumentVariableStore from './documentVariableStore'
import DocumentVariableRepository from 'src/repos/v1/documentVariable'
import DocumentVariableGroupStore from './documentVariableGroupStore'
import DocumentVariableGroupRepository from 'src/repos/v1/documentVariableGroup'

export class RootStore {
  authStore: AuthStore
  fileStore: FileStore
  dialogStore: DialogStore
  viewportStore: ViewportStore
  screenRecorderStore: ScreenRecorderStore
  uiState: UiState
  authCodeRepository: AuthCodeRepository
  bookmarkStore: BookmarkStore
  logStore: LogStore
  noteStore: NoteStore
  findingStore: FindingStore
  simDocStore: SimDocStore
  folderStore: FolderStore
  domainStore: DomainStore
  keyConceptStore: KeyConceptStore
  policyStore: PolicyStore
  clientUnitStore: ClientUnitStore
  simulationStore: SimulationStore
  assessmentTypeStore: AssessmentTypeStore
  assessmentCycleStore: AssessmentCycleStore
  modalStore: ModalStore
  agreementStore: AgreementStore
  templateStore: TemplateStore
  docStore: DocStore
  userStore: UserStore
  roleStore: RoleStore
  assessmentStore: AssessmentStore
  settingStore: SettingStore
  routerStore: RouterStore
  userAssessmentCycleStore: UserAssessmentCycleStore
  userSimulationStore: UserSimulationStore
  answerStore: AnswerStore
  scoringManagementStore: ScoringManagementStore
  documentStore: DocumentStore
  documentPageStore: DocumentPageStore
  documentVariableStore: DocumentVariableStore
  documentVariableGroupStore: DocumentVariableGroupStore

  constructor() {
    this.authStore = new AuthStore(this, new UserRepository())
    this.fileStore = new FileStore(this, new FileRepository())
    this.dialogStore = new DialogStore(this)
    this.viewportStore = new ViewportStore(this, new ViewportRepository())
    this.screenRecorderStore = new ScreenRecorderStore(
      this,
      new ScreenRecorderRepository()
    )
    this.answerStore = new AnswerStore(this, new AnswerRepository())
    this.uiState = new UiState(this)
    this.bookmarkStore = new BookmarkStore(this, new BookmarkRepository())
    this.logStore = new LogStore(this, new LogRepository())
    this.noteStore = new NoteStore(this, new NoteRepository())
    this.findingStore = new FindingStore(this, new FindingRepository())
    this.simDocStore = new SimDocStore(this, new SimDocRepository())
    this.folderStore = new FolderStore(this, new FolderRepository())
    this.domainStore = new DomainStore(this, new DomainRepository())
    this.keyConceptStore = new KeyConceptStore(this, new KeyConceptRepository())
    this.policyStore = new PolicyStore(this, new PolicyRepository())
    this.clientUnitStore = new ClientUnitStore(this, new ClientUnitRepository())

    this.routerStore = new RouterStore(this)
    this.simulationStore = new SimulationStore(this, new SimulationRepository())
    this.assessmentTypeStore = new AssessmentTypeStore(
      this,
      new AssessmentTypeRepository()
    )
    this.assessmentCycleStore = new AssessmentCycleStore(
      this,
      new AssessmentCycleRepository()
    )
    this.modalStore = new ModalStore(this)
    this.agreementStore = new AgreementStore(this, new AgreementRepository())
    this.templateStore = new TemplateStore(this, new TemplateRepository())
    this.docStore = new DocStore(this, new DocRepository())
    this.userStore = new UserStore(this, new UserRepository())
    this.roleStore = new RoleStore(this, new RoleRepository())
    this.assessmentStore = new AssessmentStore(this, new AssessmentRepository())
    this.authCodeRepository = new AuthCodeRepository()
    this.settingStore = new SettingStore(this, new SettingRepository())
    this.userSimulationStore = new UserSimulationStore(
      this,
      new UserSimulationRepository()
    )
    this.userSimulationStore = new UserSimulationStore(
      this,
      new UserSimulationRepository()
    )
    this.userAssessmentCycleStore = new UserAssessmentCycleStore(
      this,
      new UserAssessmentCycleRepository()
    )
    this.scoringManagementStore = new ScoringManagementStore(this)
    this.documentVariableStore = new DocumentVariableStore(
      this,
      new DocumentVariableRepository()
    )
    this.documentVariableGroupStore = new DocumentVariableGroupStore(
      this,
      new DocumentVariableGroupRepository()
    )
    this.documentStore = new DocumentStore(this, new DocumentRepository())
    this.documentPageStore = new DocumentPageStore(
      this,
      new DocumentPageRepository()
    )
  }
}

let store: RootStore = new RootStore()

export const createRootStore = () => {
  let _store: RootStore = store ? store : new RootStore()

  if (typeof window === 'undefined') return _store

  return _store
}
