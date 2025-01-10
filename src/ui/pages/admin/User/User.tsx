import UserView from './UserView'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getRolesFilter = () => ({
  isDeleted: false,
})

const getClientsFilter = () => ({
  isDeleted: false,
})

const getBusinessUnitsFilter = () => ({
  isDeleted: false,
})

const getContriesFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'roles',
    getFilter: getRolesFilter,
  }),
  withFind({
    collectionName: 'clientUnits',
    getFilter: getClientsFilter,
  }),
  withFind({
    collectionName: 'countries',
    getFilter: getContriesFilter,
  })
)(UserView)
