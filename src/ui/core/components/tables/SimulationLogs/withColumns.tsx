import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { Box } from '@mui/material'
import { WrappingFunction } from '@shopify/react-compose'
import moment from 'moment'
import { observer } from 'mobx-react'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
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
        Header: 'Message',
        accessor: 'message',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return cellProps.value || ''
        },
      },
      {
        Header: 'Created by',
        accessor: 'userName',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return cellProps.value || ''
        },
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return moment(cellProps.value).format('DD/MMM/YYYY hh:mm')
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
