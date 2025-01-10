import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { Box, Button, IconButton } from '@mui/material'
import CellButtons from '@components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import palette from 'src/theme/palette'
import { IDocumentVariableGroup } from 'src/models/documentVariableGroup/types'
import Variable from './Variable'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
    const {
      uiState: { modal },
      documentVariableStore,
    } = useRootStore()

    const highlightedText = (text: any, query: any) => {
      if (query !== '' && text?.toString()?.toLowerCase()?.includes(query)) {
        const parts =
          text?.toString()?.split(new RegExp(`(${query})`, 'gi')) || []

        return (
          <>
            {parts.map((part: any, index: any) =>
              part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index}>{part}</mark>
              ) : (
                part
              )
            )}
          </>
        )
      }

      return text
    }

    const columns: Array<AdminColumn> = [
      {
        Header: 'Group',
        accessor: 'group.name',
        type: Type.String,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        Header: 'Key',
        accessor: 'key',
        type: Type.String,
        collectionName: 'documentVariables',
        minWidth: 400,
        maxWidth: 1000,
        Cell: (cellProps: any) => {
          return highlightedText(
            cellProps.value,
            props?.params?.options?.fields?.searchString || ''
          )
        },
      },
      {
        Header: 'Value',
        accessor: 'value',
        type: Type.String,
        collectionName: 'documentVariables',
        minWidth: 400,
        maxWidth: 1000,
        Cell: (cellProps: any) => {
          return highlightedText(
            cellProps.value,
            props?.params?.options?.fields?.searchString || ''
          )
        },
      },
      {
        Header: 'Created Date',
        accessor: 'createdAt',
        type: Type.Date,
        cellType: CellType.Date,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        Header: 'Updated Date',
        accessor: 'updatedAt',
        type: Type.Date,
        cellType: CellType.Date,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        Header: 'Action',
        accessor: '_id',
        collectionName: 'documentVariableGroups',
        Cell: CellButtons,
        storeKey: 'documentVariableStore',
        mutateKey: 'documentVariables',
        edit: async (_props) => {
          documentVariableStore.form = _props.row.original
          console.log(documentVariableStore.form)
          modal.open('DocumentVariableGroup', <Variable />)
        },
        minWidth: 200,
        maxWidth: 200,
      },
    ]

    const row = {
      selected: true,
    }

    const meta = {
      columns,
      row,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
