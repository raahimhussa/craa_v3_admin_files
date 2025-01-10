export enum UserStatus {
  Approval = 'Approval',
  Dropout = 'Dropout',
  Verified = 'Verified',
}

export enum ResultsView {
  Always = 'Always',
  AfterDistribution = 'After Distribution',
}
export enum ResultsType {
  Full = 'Full',
  Annotated = 'Annotated',
}

export enum AnswerStatus {
  InCorrect = 'Incorrect',
  Correct = 'Correct',
  NotScored = 'NotScored',
}

export enum ScorerStatus {
  Pending = 'Pending',
  HasNotStarted = 'HasNotStarted',
  InProgress = 'InProgress',
  Complete = 'Complete',
}

export enum UserSimulationStatus {
  HasNotAssigned = 'HasNotAssigned',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  Pending = 'Pending',
  Scoring = 'Scoring',
  Adjudicating = 'Adjudicating',
  Reviewed = 'Reviewed',
  Exported = 'Exported',
  Published = 'Published',
  Distributed = 'Distributed',
}

export enum FindingStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Deleted = 'Deleted',
}

export enum AssessmentStatus {
  Complete = 'Complete',
  Pending = 'Pending',
  InProgress = 'InProgress',
}

export enum AssessmentCycleType {
  Normal = 'NORMAL',
  StandAlone = 'STAND ALONE',
}

export enum SimulationType {
  None = 'None',
  Baseline = 'Baseline',
  Followup = 'Followup',
}

export enum TrainingStatus {
  HasNotAssigned = 'HasNotAssigned',
  HasNotStarted = 'HasNotStarted',
  InProgress = 'InProgress',
  Complete = 'Complete',
}

export enum DocumentType {
  StudyMedication = 'StudyMedication',
  RescueMedication = 'RescueMedication',
  Html = 'Html',
  Document = 'Document',
}

export enum GradeType {
  Basic = 'Basic',
  Continuum = 'Continuum',
}

export enum SimulationAnnouncementTemplateType {
  Agreement = 'Agreement',
  OnSubmission = 'OnSubmission',
}

export enum TemplateStatus {
  Draft = 'Draft',
  Published = 'Published',
}

export enum AgreementVariableKey {
  UserName = 'UserName',
  UserEmail = 'UserEmail',
  UserFirstName = 'UserFirstName',
  UserLastName = 'UserLastName',
}

export enum OnSubmissionVariableKey {
  UserName = 'UserName',
  UserEmail = 'UserEmail',
  UserFirstName = 'UserFirstName',
  UserLastName = 'UserLastName',
}

export enum AdminLogScreen {
  // undefined
  Undefined = 'undefined',
  // Security
  SignInSecurity = 'signInSecurity',
  // Data
  DataDump = 'dataDump',
  BUTRStatus = 'BUTRStatus',
  // Users
  Roles = 'roles',
  Clients = 'clients',
  UserManagement = 'userManagement',
  SimManagement = 'simManagement',
  UserStatusManagement = 'userStatusManagement',
  InvoiceManagement = 'invoiceManagement',
  Permissions = 'permissions',
  LogExports = 'logExports',
  // Scoring
  ScoringManagement = 'scoringManagement',
  Scores = 'scores',
  Scoring = 'scoring',
  Adjudications = 'adjudications',
  Adjudicating = 'adjudicating',
  Review = 'review',
  Performance = 'performance',
  SimDistribution = 'simDistribution',
  // Assessment Cycles
  AssessmentCycles = 'assessmentCycles',
  AssessmentTypes = 'assessmentTypes',
  PDFFiles = 'pdfFiles',
  Resources = 'resources',
  Simulations = 'simulations',
  // Resource
  DocumentFindings = 'documentFindings',
  Instructions = 'instructions',
  Protocols = 'protocols',
  // Findings
  Findings = 'findings',
  KeyConcepts = 'keyConcepts',
  Domains = 'domains',
  // Systems
  PrivacyPolicy = 'privacyPolicy',
  EmailTemplates = 'emailTemplates',
  Settings = 'settings',
  Migration = 'migration',
  DocumentChangeLogAudit = 'documentChangeLogAudit',
  SimResources = 'simResources'
}
export enum AdminLogEvent {
  // Common
  Export = 'export',
  // Add
  Add = 'add',
  // Edit
  Edit = 'edit',
  // Delete
  Delete = 'delete',
  Activate = 'activate',
  Deactivate = 'deactivate',
  // // Security
  // SignInSecurity,
  // // Data
  // DataDump,
  // BUTRStatus,
  // // Users
  // Roles,
  // Clients,
  // UserManagement,
  AssignSimulation = 'assignSimulation',
  RemoveSimulation = 'removeSimulation',
  // SimManagement,
  ReopenSimulation = 'reopenSimulation',
  ReAllocateSimulation = 'reallocateSimulation',
  // UserStatusManagement,
  Verify = 'verify',
  SignOff = 'signOff',
  // InvoiceManagement,
  Invoice = 'invoice',
  // Permissions,
  Permission = 'permission',
  // LogExports,
  // // Scoring
  // ScoringManagement,
  ScoringSetting = 'scoringSetting',
  PublishSimulation = 'publishSimulation',
  ExpediteSimulation = 'expediteSimulation',
  Scorer = 'scorer',
  ScorerStatus = 'scorerStatus',
  RetractSimulation = 'retractSimulation',
  // Scores, = start, pause, submit, continue
  Scoring = 'scoring',
  // Scoring,
  // etc..
  // Adjudications, = start, pause, submit, continue
  Adjudicating = 'adjudicating',
  // Adjudicating,
  // Review,
  // Performance,
  // SimDistribution,
  DistributeSimulation = 'distributeSimulation',
  // // Assessment Cycles
  // AssessmentCycles,
  // AssessmentTypes,
  // PDFFiles,
  // Resources,
  Resource = 'resource',
  // AddFolderToSimulation = 'addFolderToSimulation',
  // DeleteFolderFromSimulation = 'deleteFolderFromSimulation',
  // AddDocumentToSimulation = 'addDocumentToSimulation',
  // DeleteDocumentFromSimulation = 'deleteDocumentFromSimulation',
  // AddFindingToDocument = 'addFindingToDocument',
  // DeleteFindingsFromDocument = 'deleteFindingsFromDocument',
  // SelectPDFFileToDocument = 'selectPDFFileToDocument',
  // SelectHTMLFileToDocument = 'selectHTMLFileToDocument',
  // ChangeDocumentType = 'changeDocumentType',
  // SaveDocumentPillData = 'saveDocumentPillData',
  // Simulations,
  // // Findings
  // Findings,
  ImportFindings = 'importFindings',
  // KeyConcepts,
  // Domains,
  // // Systems
  // PrivacyPolicy,
  // EmailTemplates,
  // Settings,
  // Migration,
  MigrationDemoVersion = 'changeMigrationDemoVersion',
  Migration = 'migration',
}
