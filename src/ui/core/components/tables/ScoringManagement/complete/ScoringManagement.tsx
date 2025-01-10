import AssessmentsView from './ScoringManagementView'
import compose from '@shopify/react-compose'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'
import { withState, withFind } from '@hocs'

import IRole from 'src/models/role/role.interface';

const getRolesFilter = () => ({isDeleted: false})

const withRoles = withFind({
  collectionName: 'roles',
  getFilter: getRolesFilter
})

const getUsersFilter = (props: { roles: IRole[] }) => {
  const scorerRoles = ['SimScorer', 'Admin'];
  return {
    roleId: {
      $in: props.roles
        .filter((role) => scorerRoles.includes(role.title))
        .map((role) => role._id),
    },
  };
}

// withFind HOC to fetch the users
const withUsers = withFind({
  collectionName: 'users',
  getFilter: getUsersFilter,
});

const getClientsFilter = () => ({isDeleted: false})

const withClients = withFind({
  collectionName: 'clientunits',
  getFilter: getClientsFilter
})

const getState = () => ({
  selectedRowIds: [],
})

export default compose<any>(
  withState(getState),
  withRoles,
  withUsers,
  withClients,
  withColumns,
  withLeftButtons,
  withRightButtons
)(AssessmentsView)
