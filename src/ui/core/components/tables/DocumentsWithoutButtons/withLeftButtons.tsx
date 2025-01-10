import { AdminButton } from 'src/ui/core/components/DataGrid/DataGrid'
import FileSelect from 'src/ui/core/components/FileSelect/FileSelect'
import Uploader from 'src/ui/core/components/Uploader/Uploader'
import { Utils } from '@utils'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import useMatchMutate from 'src/hooks/useMatchMutate'
import { useRootStore } from 'src/stores'
import { useSWRConfig } from 'swr'
import DocumentBuilder from '@components/DocumentBuilder/DocumentBuilder'
import DocumentPage from 'src/models/documentPage'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, documentsMutate } = props
    const {
      uiState: { modal },
      documentStore,
      documentPageStore,
    } = useRootStore()

    const leftButtons: AdminButton[] = [
      {
        title: 'Create',
        color: 'primary',
        onClick: async () => {
          // const defualtPage = new DocumentPage(documentPageStore, {
          //   // _id: '',
          //   order: 0,
          //   content: '',
          //   isDeleted: false,
          //   createdAt: 0,
          //   updatedAt: 0,
          // })
          documentStore.resetForm()
          documentStore.pages = [
            {
              order: 0,
              content: '',
            },
          ]
          //@ts-ignore
          documentStore.form = await documentStore.save()
          console.log('credated>>>>', documentStore.form)
          modal.open(
            'DocumentBuilder',
            <DocumentBuilder mutate={documentsMutate} />
          )
        },
      },
    ]
    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
