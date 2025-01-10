import { AdminButton } from 'src/ui/core/components/DataGrid/DataGrid'
import FileSelect from 'src/ui/core/components/FileSelect/FileSelect'
import Uploader from 'src/ui/core/components/Uploader/Uploader'
import { Utils } from '@utils'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import useMatchMutate from 'src/hooks/useMatchMutate'
import { useRootStore } from 'src/stores'
import { useSWRConfig } from 'swr'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const {
      uiState: { modal },
    } = useRootStore()

    const leftButtons: AdminButton[] = [
      {
        title: 'Upload',
        color: 'primary',
        onClick: () => {
          modal.open('Uploader', <Uploader />)
        },
      },
    ]
    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
