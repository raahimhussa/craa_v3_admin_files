import SigninReviewView from './SigninReviewView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withREST({
    collectionName: 'logManager',
    version: 3,
    path: () => 'security/signin-review',
    propName: 'authLogs',
  })
)(SigninReviewView)
