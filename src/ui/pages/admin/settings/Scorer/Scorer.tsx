import IRole from 'src/models/role/role.interface'
import ScorerView from './ScorerView'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

const getRolesFilter = () => ({})

const getUsersFilter = (props: { roles: IRole[] }) => {
  const scorerRoles = ['SimScorer', 'Admin']
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
    collectionName: 'roles',
    getFilter: getRolesFilter,
  }),
  withFindOne({
    collectionName: 'settings',
    getFilter: () => ({ kind: 'ScorerSetting' }),
    version: 2,
  }),
  withFind({
    collectionName: 'users',
    getFilter: getUsersFilter,
  })
)(ScorerView)
