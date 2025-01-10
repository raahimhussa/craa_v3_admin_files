import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { Box } from '@mui/material'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import StudyDocument from 'src/ui/pages/admin/modals/StudyDocument/StudyDocument'
import StudyDocuments from './StudyDocuments'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns = (WrappedComponent: any) =>
  observer((props: any) => {
    const {
      uiState: { modal },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'TITLE',
        accessor: 'title',
        cellType: CellType.Editable,
        collectionName: 'docs',
        type: Type.Number,
        minWidth: 300,
      },
      {
        Header: 'Document type',
        accessor: 'kind',
        minWidth: 150,
      },
      // {
      //   Header: 'Actions',
      //   collectionName: 'docs',
      //   storeKey: 'docStore',
      //   mutateKey: 'docs',
      //   Cell: CellButtons,
      //   minWidth: 150,
      //   edit: () => {
      //     props.onClickOpen && props.onClickOpen()
      //   },
      // },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
