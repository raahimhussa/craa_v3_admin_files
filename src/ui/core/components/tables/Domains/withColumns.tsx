import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { AdminLogScreen } from 'src/utils/status'
import { Box } from '@mui/material'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Domain from 'src/ui/pages/admin/Domain/Domain'
import Domains from 'src/ui/pages/admin/Domains/Domains'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const {
      keyConceptStore,
      uiState: { modal },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'ID',
        accessor: 'visibleId',
        Cell: (props: any) => {
          const value = props.row.original.visibleId
          return <Box>{value < 0 ? 'n/a' : value}</Box>
        },
      },
      {
        Header: 'Domain',
        accessor: 'name',
        collectionName: 'domains',
        // cellType: CellType.Editable,
        type: Type.String,
        minWidth: 300,
      },
      {
        Header: 'Subdomains',
        accessor: '_id',
        cellType: CellType.SubComponent,
        renderRowSubComponent: ({ row }: any) => {
          return (
            <Domains depth={1} parentId={row.original._id} isSubTable={true} />
          )
        },
      },
      // Property to distinguish trainable domains from non-trainalbe domains, 
      // mostly the five top-level domains.      
      {
        Header: 'Remediable',
        accessor: 'remediable',
        collectionName: 'domains',
        // cellType: CellType.Editable,
        type: Type.Boolean,
        minWidth: 300,
        Cell: (props: any) => {
          const value = props.row.original.remediable;
          
          if(value) {
            return <Box>{value.toString().toUpperCase()}</Box>
          } else {
            return <Box />
          }
        },        
      },      
      {
        Header: 'actions',
        collectionName: 'domains',
        storeKey: 'domainStore',
        Cell: CellButtons,
        screen: AdminLogScreen.Domains,
        minWidth: 150,
        edit: () => {
          modal.open('Domain', <Domain />)
        },
      },
    ]

    const meta = {
      columns: rest.isSubTable
        ? columns.filter((column) => column.cellType !== CellType.SubComponent)
        : columns,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
