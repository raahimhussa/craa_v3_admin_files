import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { AdminLogScreen } from 'src/utils/status'
import AssessmentType from 'src/ui/pages/admin/modals/AssessmentType/AssessmentType'
import { Button } from '@mui/material'
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
        Header: 'Label',
        accessor: 'label',
        minWidth: 200,
      },
      {
        Header: 'added Date',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 150,
      },
      {
        Header: 'actions',
        storeKey: 'assessmentTypeStore',
        mutateKey: 'assessmentTypes',
        Cell: CellButtons,
        screen: AdminLogScreen.AssessmentTypes,
        minWidth: 150,
        mutate: async () => {
          props.assessmentTypesMutate && (await props.assessmentTypesMutate())
          props.countMutate && (await props.countMutate())
        },
        edit: () => {
          const mutate = async () => {
            props.assessmentTypesMutate && (await props.assessmentTypesMutate())
            props.countMutate && (await props.countMutate())
          }
          modal.open('AssessmentType', <AssessmentType mutate={mutate} />)
        },
      },
      {
        Header: 'Duplicate',
        width: 100,
        Cell: (cellProps: CellProps<any>) => {
          const [open, setOpen] = useState<boolean>(false)
          const [label, setLabel] = useState<string>(
            `${cellProps.row.original.label} copy`
          )
          const assessmentType = cellProps.row.original

          const onClickOpen = () => {
            setOpen(true)
          }
          const onClickDuplicate = async () => {
            const _assessmentType = { ...assessmentType }
            delete _assessmentType._id
            delete _assessmentType.createdAt
            delete _assessmentType.updatedAt
            _assessmentType.label = label
            await axios.post('v1/assessmentTypes', _assessmentType)
            props.assessmentTypesMutate && (await props.assessmentTypesMutate())
          }

          const onChangeText = (text: string) => {
            setLabel(text)
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
                value={label}
                unit={'label'}
                title={`Are you sure you want to duplicate "${assessmentType.label}"?`}
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
