import SimDocsView from './SimDocsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
export enum DocKind {
  Protocol = 'protocol',
  Instruction = 'instruction',
  StudyDocument = 'studyDocument',
  RiskManagement = 'riskManagement',
}

const getFilter = () => ({
  isDeleted: false,
})

const getDocsFilter = () => ({
  isDeleted: false,
})

const getOptions = () => ({
  sort: {
    createdAt: -1,
  },
})

export default compose<any>(
  withFind({
    collectionName: 'docs',
    getFilter: getDocsFilter,
    getOptions,
    uiStoreKey: 'docs',
  }),
  withFind({
    collectionName: 'simulations',
    getFilter,
  }),
  withFind({
    collectionName: 'simDocs',
    getFilter,
  }),
  withFind({
    collectionName: 'folders',
    version: 2,
    getFilter,
  }),
  withFind({
    collectionName: 'assessmentTypes',
    getFilter: () => ({
      isDeleted: false,
    }),
    version: 1,
  })
)(SimDocsView)
