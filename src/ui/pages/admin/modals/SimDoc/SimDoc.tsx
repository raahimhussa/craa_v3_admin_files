import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
import withPayload from 'src/hocs/withPayload'
import SimDocView from './SimDocView'

const getState = (props: any) => {
  const { isEditMode, row } = props
  const simDoc = { ...row }

  return {
    selectedRowIds: [],
    simDoc: isEditMode
      ? simDoc
      : {
          label: '',
          domainCategory: {
            paths: [],
            text: '',
          },
          file: null,
        },
  }
}
const getCategoryFilter = () => {
  return {
    kind: 'domain',
    isDeleted: false,
  }
}
const getFilesFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withPayload('simDoc'),
  withFindOne({ collectionName: 'categories', getFilter: getCategoryFilter }),
  withFind({ collectionName: 'files', getFilter: getFilesFilter }),
  withState(getState)
)(SimDocView)
