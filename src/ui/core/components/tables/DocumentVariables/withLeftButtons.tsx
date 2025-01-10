import { AdminButton } from 'src/ui/core/components/DataGrid/DataGrid'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import DocumentPage from 'src/models/documentPage'
import Group from './Group'
import Variable from './Variable'
import { useState } from 'react'
import Import from './Import'

const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const {
      uiState: { modal },
      documentStore,
      documentPageStore,
    } = useRootStore()

    const leftButtons: AdminButton[] = [
      {
        title: 'Import',
        color: 'primary',
        onClick: () => {
          modal.open('Import', <Import />)
        },
      },
      {
        title: 'New variable',
        color: 'primary',
        onClick: () => {
          modal.open('New Variable', <Variable />)
        },
      },
      {
        title: 'Groups',
        color: 'primary',
        onClick: () => {
          modal.open('New Group', <Group />)
        },
      },
    ]
    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
