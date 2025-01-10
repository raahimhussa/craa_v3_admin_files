import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { useEffect, useState } from 'react'

import { AdminLogScreen } from 'src/utils/status'
import { Button } from '@mui/material'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import DuplicateDialogue from '@components/DuplicateDialogue/DuplicateDialogue'
import Simulation from 'src/ui/pages/admin/Simulation/Simulation'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal, simulations },
    } = useRootStore()

    const columns: Array<AdminColumn> = [
      {
        Header: 'ID',
        accessor: 'visibleId',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Name',
        accessor: 'name',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Label',
        accessor: 'label',
        minWidth: 200,
        type: Type.String,
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
      // {
      //   Header: 'Actions',
      //   minWidth: 200,
      //   type: Type.String,
      //   storeKey: 'simulationStore',
      //   mutateKey: 'simulations',
      //   Cell: CellButtons,
      //   screen: AdminLogScreen.Simulations,
      //   mutate: props.simulationsMutate,
      //   edit: () => {
      //     modal.open(
      //       'Simulation',
      //       <Simulation mutate={props.simulationsMutate} />
      //     )
      //   },
      // },
      // {
      //   Header: 'Duplicate',
      //   width: 100,
      //   Cell: (cellProps: CellProps<any>) => {
      //     const [open, setOpen] = useState<boolean>(false)
      //     const [name, setName] = useState<string>(
      //       `${cellProps.row.original.name} copy`
      //     )
      //     const simulation = cellProps.row.original

      //     const onClickOpen = () => {
      //       setOpen(true)
      //     }

      //     const onClickDuplicate = async () => {
      //       const _simulation = { ...simulation }
      //       delete _simulation._id
      //       delete _simulation.createdAt
      //       delete _simulation.updatedAt
      //       _simulation.name = name
      //       await axios.post('v1/simulations', _simulation)
      //       props.simulationsMutate && (await props.simulationsMutate())
      //     }

      //     const onChangeText = (text: string) => {
      //       setName(text)
      //     }
      //     return (
      //       <>
      //         <Button variant="contained" onClick={onClickOpen}>
      //           Duplicate
      //         </Button>
      //         <DuplicateDialogue
      //           open={open}
      //           handleClose={() => setOpen(false)}
      //           onDuplicate={onClickDuplicate}
      //           onChangeText={onChangeText}
      //           value={name}
      //           unit={'name'}
      //           title={`Are you sure you want to duplicate "${simulation.name}"?`}
      //           text={
      //             "This item will be duplicated permanently. You can't undo this action."
      //           }
      //           yesText={'Duplicate'}
      //           noText={'Cancel'}
      //         />
      //       </>
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
