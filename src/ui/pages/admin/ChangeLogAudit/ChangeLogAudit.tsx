import ChangeLogAuditView from './ChangeLogAuditView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

import IRole from 'src/models/role/role.interface'

export enum DocKind {
  Document = 'protocol',
  Instruction = 'instruction',
  StudyDocument = 'studyDocument',
  RiskManagement = 'riskManagement',
}

const getPDFFileChangeFilter = () => ({
  screen: "pdfFiles",
})

const getSimuResourcesChangeFilter = () => ({
  screen: 'simResources',
})

const getOptions = () => ({
  sort: {
    createdAt: -1,
  },
})

const getRolesFilter = () => ({})

const getUsersFilter = (props: { roles: IRole[] }) => {
  const scorerRoles = ['Admin']
  return {
    roleId: {
      $in: props.roles
        .filter((role) => scorerRoles.includes(role.title))
        .map((role) => role._id),
    },
  }
}

export default compose<any>(
  withFind({
    collectionName: 'adminLogs',
    version: 2,
    getFilter: getSimuResourcesChangeFilter,
    getOptions,
  }),
  withFind({
    collectionName: 'adminLogs',
    version: 2,
    getFilter: getPDFFileChangeFilter,
    getOptions,
    // uiStoreKey: 'adminLogs',
  }),  
  withFind({
    collectionName: 'roles',
    getFilter: getRolesFilter,
  }), 
  withFind({
    collectionName: 'users',
    getFilter: getUsersFilter,
  }),    
)(ChangeLogAuditView)
