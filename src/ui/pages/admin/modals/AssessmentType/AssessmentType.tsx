import { withFind, withState } from '@hocs'

import AssessmentTypeView from './AssessmentTypeView'
import compose from '@shopify/react-compose'
import { uuid } from 'uuidv4'
import withFindOne from 'src/hocs/withFindOne'

export type localStateType = ReturnType<typeof getState>

const getState = () => {
  return {
    form: {
      domainId: '',
      training: {
        domain: {
          _id: '',
          label: '',
        },
        _id: '',
        label: '',
        instructionIds: [],
        protocolIds: [],
        riskManagementIds: [],
        testTime: 8 * 60 * 60,
      },
      followup: {
        domain: {
          _id: '',
          label: '',
        },
        label: '',
        simulationId: '',
        studyLogIds: [],
        attemptCount: 5,
        instructionIds: [],
        protocolIds: [],
        riskManagementIds: [],
        testTime: 8 * 60 * 60,
      },
    },
  }
}

const getFilter = () => ({
  isDeleted: false,
  isActivated: true,
})

const getCategoryFilter = () => ({
  depth: 0,
  followupNumber: { $gt: 0 },
  isDeleted: false,
})

export default compose<any>(
  withFind({ collectionName: 'docs', getFilter }),
  withFind({
    collectionName: 'domains',
    getFilter: getCategoryFilter,
    version: 2,
  }),
  withFind({ collectionName: 'simulations', getFilter }),
  withFind({
    collectionName: 'simDocs',
    getFilter,
  }),
  withFind({
    collectionName: 'folders',
    version: 2,
    getFilter,
  }),
  withFind({ collectionName: 'trainings', getFilter, version: 2 }),
  withState(getState)
)(AssessmentTypeView)
