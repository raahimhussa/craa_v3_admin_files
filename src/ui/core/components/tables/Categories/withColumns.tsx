import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withColumns = (WrappedComponent: any) =>
  observer((props: any) => {
    const { modalStore } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Kind',
        accessor: 'kind',
        cellType: CellType.Editable,
        type: Type.Number,
        collectionName: 'docs',
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
        accessor: 'actions',
        collectionName: 'categories',
        Cell: CellButtons,
      },
      // {
      //   Header: 'ActionButtons',
      //   cellType: CellType.Date,
      //   minWidth: 150,
      //   Cell: (cell: CellProps<any>) => {
      //     const onClickEdit = () => {
      //       modalStore.category.payload.row = cell.row.original
      //       modalStore.category.isVisible = true
      //       modalStore.category.isEditMode = true
      //     }
      //     return (
      //       <Button variant="contained" onClick={onClickEdit}>
      //         Edit
      //       </Button>
      //     )
      //   },
      // },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
