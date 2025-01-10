import Finding from 'src/ui/pages/admin/Finding/Finding'
import ImportFindings from 'src/ui/pages/admin/ImportFindings/ImportFindings'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import download from 'js-file-download'
import moment from 'moment'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      dialogStore,
      findingStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = [
      {
        title: 'Sample Export',
        onClick: async () => {
          const { data } = await axios.get('v2/findings/excel/sample', {
            responseType: 'blob',
          })
          download(data, `findings-sample.xlsx`)
        },
        color: 'primary',
      },
      {
        title: 'Export',
        onClick: async () => {
          const { data } = await axios.get('v2/findings/excel/filter', {
            responseType: 'blob',
            params: props?.params || { filter: {} },
          })
          download(
            data,
            `findings-${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`
          )
        },
        color: 'primary',
      },
      {
        title: 'Import',
        onClick: () => {
          modal.open('ImportFindings', <ImportFindings />)
          // dialogStore.dialog.type = 'success'
          // dialogStore.dialog.isVisible = true
          // dialogStore.dialog.title = 'Findings'
          // dialogStore.dialog.content = <Finding isNew={true} />
        },
        color: 'primary',
      },
      {
        title: 'NEW',
        onClick: () => {
          findingStore.resetForm()
          findingStore.selectedSimDoc = null
          modal.open(
            'Finding',
            <Finding isNew={true} findingsMutate={props.findingsMutate} />
          )
          // dialogStore.dialog.type = 'success'
          // dialogStore.dialog.isVisible = true
          // dialogStore.dialog.title = 'Findings'
          // dialogStore.dialog.content = <Finding isNew={true} />
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
