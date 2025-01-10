import TableContainerView from './TableContainerView'
import compose from '@shopify/react-compose'
import withREST from 'src/hocs/withREST'

export default compose<any>(
  withREST({
    defaultValue: [],
    collectionName: (props) => props.collectionName,
    version: (props) => props.version,
    params: (props: any) => {
      return {
        ...props.params,
        options: {
          ...props.params?.options,
          skip: props.offset,
          limit: props.limit,
        },
      }
    },
  })
)(TableContainerView)
