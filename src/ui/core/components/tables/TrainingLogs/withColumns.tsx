import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import moment from 'moment'
import { Box } from '@mui/material'
const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
    const highlightedText = (text: any, query: any) => {
      if (text === undefined) {
        return ''
      }
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
        Header: 'Training',
        accessor: 'training.title',
        type: Type.String,
        collectionName: 'trainingLogs',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'Page',
        accessor: 'pageId',
        type: Type.String,
        collectionName: 'trainingLogs',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.row.original.training?.pages[cellProps.value]?.title,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'Action',
        accessor: 'event',
        type: Type.String,
        collectionName: 'trainingLogs',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'Time',
        accessor: 'createdAt',
        type: Type.Number,
        collectionName: 'trainingLogs',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return (
            <Box
              sx={{
                lineHeight: 1.2,
              }}
            >
              <p>{moment(cellProps.value).format('DD-MMM-YYYY')}</p>
              <p>{`${moment(cellProps.value).format('HH:mm:ss')}`}</p>
            </Box>
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
