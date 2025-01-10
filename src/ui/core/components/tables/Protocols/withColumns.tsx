import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { AdminLogScreen } from 'src/utils/status'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Protocol from 'src/ui/pages/admin/modals/Protocol/Protocol'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'TITLE',
        accessor: 'title',
        cellType: CellType.Editable,
        type: Type.String,
        collectionName: 'docs',
        mutateKey: 'docs',
        minWidth: 300,
      },
      {
        Header: 'added Date',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 150,
      },
      {
        Header: 'Actions',
        collectionName: 'docs',
        modalKey: 'protocol',
        Cell: CellButtons,
        screen: AdminLogScreen.Protocols,
        storeKey: 'docStore',
        mutateKey: 'docs',
        edit: () => {
          props.onClickOpen && props.onClickOpen()
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
