import ChartsView from './ChartsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'dashboard',
    version: 3,
    getOptions: (props: any) => {
      const { clientId, pfizerId, vendors, vendorId } = props
      if (clientId === pfizerId) {
        return {
          isPfizer: true,
        }
      } else {
        return {
          isPfizer: false,
        }
      }
    },
    getFilter: (props: any) => {
      const { clientId, pfizerId, vendors, vendorId } = props
      if (clientId === pfizerId) {
        if (vendorId === 'all') {
          return {
            isDeleted: false,
            clientUnitId: {
              $in: vendors,
            },
          }
        } else {
          return {
            isDeleted: false,
            clientUnitId: vendorId,
          }
        }
      }
      if (props.businessUnitId === '') {
        return {
          isDeleted: false,
          clientUnitId: props.clientId,
        }
      } else {
        return {
          isDeleted: false,
          clientUnitId: props.clientId,
          businessUnitId: props.businessUnitId,
        }
      }
    },
  }),
  withFind({
    collectionName: 'countries',
    getFilter: (props: any) => {
      return {
        isDeleted: false,
      }
    },
  })
)(ChartsView)
// withREST({
//   collectionName: 'clientUnits',
//   path: () => '',
//   uiStoreKey: 'clientUnits',
// }),
