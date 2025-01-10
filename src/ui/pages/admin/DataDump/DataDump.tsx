import DataDumpView from './DataDumpView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'clientUnits',
    getFilter,
  })
)(DataDumpView)
