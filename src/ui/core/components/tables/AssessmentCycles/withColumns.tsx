import { AdminColumn, CellType } from 'src/ui/core/components/DataGrid/DataGrid'
import { Box, Button } from '@mui/material'
import { CopyAll, FileCopy } from '@mui/icons-material'

import { AdminLogScreen } from 'src/utils/status'
import AssessmentCycle from '../../../../pages/admin/AssessmentCycle/AssessmentCycle'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import DuplicateDialogue from '@components/DuplicateDialogue/DuplicateDialogue'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'NAME',
        accessor: 'name',
        collectionName: 'assessmentCycles',
        minWidth: 300,
      },
      {
        Header: 'Added Date',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 300,
      },
      {
        Header: 'Updated Date',
        accessor: 'updatedAt',
        cellType: CellType.Date,
        minWidth: 300,
      },

      {
        Header: 'Actions',
        accessor: 'actions',
        storeKey: 'assessmentCycleStore',
        mutateKey: 'assessmentCycles',
        screen: AdminLogScreen.AssessmentCycles,
        Cell: CellButtons,
        mutate: async () => {
          props.assessmentCyclesMutate && (await props.assessmentCyclesMutate())
          props.countMutate && (await props.countMutate())
        },
        edit: () => {
          const mutate = async () => {
            props.assessmentCyclesMutate &&
              (await props.assessmentCyclesMutate())
            props.countMutate && (await props.countMutate())
          }
          modal.open('assessmentCycle', <AssessmentCycle mutate={mutate} />)
        },
      },
      {
        Header: 'Duplicate',
        width: 100,
        Cell: (cellProps: CellProps<any>) => {
          const [open, setOpen] = useState<boolean>(false)
          const [name, setName] = useState<string>(
            `${cellProps.row.original.name} copy`
          )
          const assessmentCycle = cellProps.row.original

          const onClickOpen = () => {
            setOpen(true)
          }

          const onClickDuplicate = async () => {
            const _assessmentCycle = { ...assessmentCycle }
            delete _assessmentCycle._id
            delete _assessmentCycle.createdAt
            delete _assessmentCycle.updatedAt
            _assessmentCycle.name = name
            await axios.post('v1/assessmentCycles', _assessmentCycle)
            props.assessmentCyclesMutate &&
              (await props.assessmentCyclesMutate())
          }

          const onChangeText = (text: string) => {
            setName(text)
          }

          return (
            <>
              <Button variant="contained" onClick={onClickOpen}>
                Duplicate
              </Button>
              <DuplicateDialogue
                open={open}
                handleClose={() => setOpen(false)}
                onDuplicate={onClickDuplicate}
                onChangeText={onChangeText}
                value={name}
                unit={'name'}
                title={`Are you sure you want to duplicate "${assessmentCycle.name}"?`}
                text={
                  "This item will be duplicated permanently. You can't undo this action."
                }
                yesText={'Duplicate'}
                noText={'Cancel'}
              />
            </>
          )
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
