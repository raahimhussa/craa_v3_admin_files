import { withFind } from '@hocs'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
import AssignedUserAcView from './AssignedUserAcView'

const getAssesmentCyclesFilter = () => ({
  isDeleted: false,
})

const getUserFilter = ({
  userId
}: {
  userId: string
}) => ({
  _id: userId
})

export default compose<{
  userId: string
}>(
  withFind({
    collectionName: 'assessmentCycles',
    getFilter: getAssesmentCyclesFilter
  }),
  withFindOne({
    collectionName: 'users',
    getFilter: getUserFilter
  }),
)(AssignedUserAcView)
