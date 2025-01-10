import SubdomainsView from './SubdomainsView'
import compose from '@shopify/react-compose'
import withFind from 'src/hocs/withFind'
export default compose<any>(
  withFind({
    collectionName: 'domains',
    getFilter: (props: any) => {
      return { isDeleted: false, parentId: { $in: props.value } }
    },
    version: 2,
  })
)(SubdomainsView)
