import FilesDropdownView from './FilesDropdownView'
import compose from '@shopify/react-compose'
import withREST from 'src/hocs/withREST'

export default compose<any>(
  withREST({
    collectionName: 'pdfFileManagement',
    version: 3,
    params: (props) => {
      const path =
        '/' +
        props.currentPaths.slice(0, props.currentPaths.length - 1).join('/')
      const name = props.currentPaths[props.currentPaths.length - 1]
      return {
        path,
        name,
      }
    },
  })
)(FilesDropdownView)
