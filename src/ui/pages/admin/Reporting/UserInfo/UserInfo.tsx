import UserCardView from './UserInfoView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

export default compose<any>(
  withFindOne({
    collectionName: 'users',
    version: 1,
    getFilter: (props: any) => ({
      _id:
        props.userBaseline !== undefined
          ? props.userBaseline.userId
          : props.userId,
    }),
  })
)(UserCardView)
