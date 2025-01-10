function path(root: string, sublink: string) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_ADMIN = '/admin'
const ROOTS_SCORINGS = '/scorings'

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/signin'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
}

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
}

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  security: {
    root: path(ROOTS_ADMIN, '/security'),
    signinReview: path(ROOTS_ADMIN, '/security/signin-review'),
  },
  documentBuilder: {
    root: path(ROOTS_ADMIN, '/documentBuilder'),
    documents: path(ROOTS_ADMIN, '/documentBuilder/documents'),
    variables: path(ROOTS_ADMIN, '/documentBuilder/variables'),
  },
  data: {
    root: path(ROOTS_ADMIN, '/data'),
    dataDump: path(ROOTS_ADMIN, '/data/dataDump'),
    butrStatus: path(ROOTS_ADMIN, '/data/butrStatus'),
    dashboard: path(ROOTS_ADMIN, '/data/dashboard'),
  },
  users: {
    root: path(ROOTS_ADMIN, '/users'),
    roles: path(ROOTS_ADMIN, '/users/roles'),
    clients: path(ROOTS_ADMIN, '/users/clients'),
    userManagement: path(ROOTS_ADMIN, '/users/userManagement'),
    simManagement: path(ROOTS_ADMIN, '/users/simManagement'),
    invoice: path(ROOTS_ADMIN, '/users/invoice'),
    userStatusManagement: path(ROOTS_ADMIN, '/users/userStatusManagement'),
    profile: path(ROOTS_ADMIN, '/users/profile'),
    logs: path(ROOTS_ADMIN, '/users/logs'),
    permissions: path(ROOTS_ADMIN, '/users/permissions'),
  },
  scorings: {
    root: path(ROOTS_ADMIN, '/scoring'),
    manage: path(ROOTS_ADMIN, '/scoring/manage'),
    score: path(ROOTS_ADMIN, '/scoring/score'),
    adjudicate: path(ROOTS_ADMIN, '/scoring/adjudicate'),
    review: path(ROOTS_ADMIN, '/scoring/review'),
    performance: path(ROOTS_ADMIN, '/scoring/performance'),
    simDistributions: path(ROOTS_ADMIN, '/scoring/simDistributions'),
  },
  assessmentCycles: {
    root: path(ROOTS_ADMIN, '/assessmentCycles'),
    assessmentCycles: path(ROOTS_ADMIN, '/assessmentCycles/assessmentCycles'),
    files: path(ROOTS_ADMIN, '/assessmentCycles/files'),
    resources: path(ROOTS_ADMIN, '/assessmentCycles/resources'),
    simulations: path(ROOTS_ADMIN, '/assessmentCycles/simulations'),
    assessmentTypes: path(ROOTS_ADMIN, '/assessmentCycles/assessmentTypes'),
    // documentChangeLogAudit: path(ROOTS_ADMIN, '/assessmentCycles/documentChangeLogAudit'),
    changeLogAudit: path(ROOTS_ADMIN, '/assessmentCycles/changeLogAudit'),
  },
  findings: {
    root: path(ROOTS_ADMIN, '/findings'),
    list: path(ROOTS_ADMIN, '/findings/list'),
    keyConcepts: path(ROOTS_ADMIN, '/findings/keyConcepts'),
    domain: path(ROOTS_ADMIN, '/findings/domains'),
  },
  system: {
    root: path(ROOTS_ADMIN, '/system'),
    privacyPolicy: path(ROOTS_ADMIN, '/system/privacyPolicy'),
    emailTemplate: path(ROOTS_ADMIN, '/system/emailTemplates'),
    settings: path(ROOTS_ADMIN, '/system/settings'),
    migration: path(ROOTS_ADMIN, '/system/migration'),
  },
  trainings: {
    root: path(ROOTS_ADMIN, '/trainings'),
  },
  folders: {
    root: path(ROOTS_ADMIN, '/folders'),
  },

  policies: {
    root: path(ROOTS_ADMIN, '/policies'),
  },

  vendors: {
    root: path(ROOTS_ADMIN, '/vendors'),
  },
}
