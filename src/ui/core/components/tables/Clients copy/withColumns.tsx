import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { Box, Switch } from '@mui/material'

import { AdminLogScreen } from 'src/utils/status'
import BusinessUnit from 'src/ui/pages/admin/BusinessUnit/BusinessUnit'
import BusinessUnits from './BusinessUnits/BusinessUnits'
import { Button } from 'src/ui/core/components'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Client from 'src/ui/pages/admin/Client/Client'
import { UpdateType } from 'src/stores/clientUnitStore'
import Vendors from '../Vendors/Vendors'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      clientUnitStore,
      uiState: { modal },
    } = useRootStore()

    const columns: Array<AdminColumn> = [
      {
        Header: 'ClientName',
        accessor: 'name',
        type: Type.String,
        // cellType: CellType.Editable,
        // mutateKey: 'clients',
        collectionName: 'clientUnits',
        minWidth: 250,
      },
      {
        Header: 'AuthCode',
        accessor: 'authCode',
        type: Type.String,
        minWidth: 200,
      },
      // {
      //   Header: 'ScreenRecording',
      //   accessor: 'isScreenRecordingOn',
      //   minWidth: 200,
      //   Cell: ({ row }: any) => {
      //     return (
      //       <Switch
      //         checked={row.original?.isScreenRecordingOn}
      //         onChange={(e) => {
      //           clientUnitStore.updateScreenRecordingOption(
      //             row.original._id,
      //             e.target.checked
      //           )
      //         }}
      //       />
      //     )
      //   },
      // },
      {
        Header: 'Business Units & Vendors',
        cellType: CellType.SubComponent,
        renderRowSubComponent: ({ row }: any) => {
          return (
            <Box sx={{ display: 'flex' }}>
              <BusinessUnits
                clientUnit={row.original}
                clientUnitsMutate={props.clientUnitsMutate}
              />
              <Vendors
                clientUnit={row.original}
                clientUnitsMutate={props.clientUnitsMutate}
              />
            </Box>
          )
        },
      },
      {
        Header: 'CreatedAt',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 200,
      },
      {
        Header: 'UpdatedAt',
        accessor: 'updatedAt',
        cellType: CellType.Date,
        minWidth: 200,
      },
      {
        Header: 'Actions',
        collectionName: 'clientUnits',
        Cell: CellButtons,
        screen: AdminLogScreen.Clients,
        storeKey: 'clientUnitStore',
        mutateKey: 'clientUnits',
        edit: () => {
          clientUnitStore.mutate = props.clientUnitsMutate
          modal.open('Client', <Client />)
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
