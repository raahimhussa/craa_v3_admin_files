import SearchFilesView from './SearchFilesView'
import compose from '@shopify/react-compose'
import withREST from 'src/hocs/withREST'

export default compose<any>(
  withREST({
    collectionName: 'pdfFileManagement',
    version: 3,
    path: () => 'search',
    params: (props) => {
      return {
        searchString: props?.searchString || '',
      }
    },
  })
)(SearchFilesView)
