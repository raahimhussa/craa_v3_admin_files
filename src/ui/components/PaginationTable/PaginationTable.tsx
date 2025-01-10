import PaginationTableView from './PaginationTableView'
import compose from '@shopify/react-compose'
import withREST from 'src/hocs/withREST'
import { useRootStore } from 'src/stores'

export default compose<any>(
  withREST({
    defaultValue: 0,
    collectionName: (props) => props.collectionName,
    path: () => 'count',
    params: (props) =>
      props.params
        ? {
            ...props.params,
          }
        : {
            filter: { isDeleted: false },
          },
    version: (props) => props.version,
    propName: 'count',
  })
)(PaginationTableView)
