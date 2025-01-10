import Domain from 'src/ui/pages/admin/Domain/Domain'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import download from 'js-file-download'
import moment from 'moment'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'

const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, parentId } = props
    const {
      modalStore,
      domainStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = [
      {
        title: 'Export',
        onClick: async () => {
          const { data } = await axios.get('v2/domains/excel', {
            responseType: 'blob',
          })
          download(
            data,
            `domains-${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`
          )
        },
        color: 'primary',
      },
      {
        title: 'NEW',
        onClick: () => {
          // modalStore.domain.isVisible = true
          domainStore.form.parentId = parentId
          if (parentId) domainStore.form.depth = 1
          else domainStore.form.depth = 0
          modal.open('Domain', <Domain />)
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
