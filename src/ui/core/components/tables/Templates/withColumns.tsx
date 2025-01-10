import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Template from 'src/ui/pages/admin/modals/Template/Template'
const withColumns: WrappingFunction = (WrappedComponent) => observer((props) => {
  const { uiState: { modal } } = useRootStore()
  const columns: Array<AdminColumn> = [
    {
      Header: 'Title',
      accessor: 'title',
      collectionName: 'templates',
      cellType: CellType.Editable,
      type: Type.Number,
      minWidth: 300,
    },
    {
      Header: 'Kind',
      accessor: 'key',
      collectionName: 'templates',
      cellType: CellType.Editable,
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
      collectionName: 'templates',
      Cell: CellButtons,
      minWidth: 150,
      mutateKey: 'templates',
      storeKey: 'templateStore',
      edit: () => {
        modal.open('Template', <Template />)
      }
    },
  ]

  const meta = {
    columns,
  }

  return <WrappedComponent {...props} {...meta} />
})

export default withColumns
