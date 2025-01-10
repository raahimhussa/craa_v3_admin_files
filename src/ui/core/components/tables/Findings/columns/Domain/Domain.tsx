import DomainView from './DomainView'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
export default compose<any>(
  withFindOne({
    collectionName: 'domains',
    getFilter: (props: any) => {
      return { isDeleted: false, _id: props.domainId }
    },
    version: 2,
  })
)(DomainView)
