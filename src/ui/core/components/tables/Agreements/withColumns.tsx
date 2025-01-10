import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { AdminLogScreen } from 'src/utils/status'
import Agreement from 'src/ui/pages/admin/modals/Agreement/Agreement'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
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
        Header: 'Label',
        accessor: 'label',
        collectionName: 'agreements',
        // cellType: CellType.Editable,
        type: Type.Number,
        minWidth: 300,
      },
      {
        Header: 'type',
        accessor: 'kind',
        type: Type.String,
        minWidth: 100,
      },
      {
        Header: 'key',
        accessor: 'key',
        type: Type.String,
        minWidth: 100,
      },
      {
        Header: 'added Date',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 150,
      },
      {
        Header: 'actions',
        storeKey: 'agreementStore',
        Cell: CellButtons,
        minWidth: 150,
        mutateKey: 'agreements',
        edit: () => {
          modal.open('Agreement', <Agreement />)
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
