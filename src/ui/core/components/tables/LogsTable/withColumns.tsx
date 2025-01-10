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
        Header: 'Simulation',
        accessor: 'simulation.name',
        type: Type.String,
        collectionName: 'logs',
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
        Header: 'Action',
        accessor: 'event',
        type: Type.String,
        collectionName: 'logs',
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
        Header: 'Venue',
        accessor: 'screen',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 50,
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
        Header: 'VP1',
        accessor: 'viewports.0.simDoc.title',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
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
        Header: 'VP2',
        accessor: 'viewports.1.simDoc.title',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
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
        Header: 'VP3',
        accessor: 'viewports.2.simDoc.title',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
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
        collectionName: 'logs',
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
      {
        Header: 'Timer',
        accessor: 'duration',
        type: Type.Number,
        collectionName: 'logs',
        minWidth: 100,
        Cell: (cellProps: any) => {
          return cellProps.value !== 0
            ? moment.utc(cellProps.value * 1000).format('HH:mm:ss')
            : '--'
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
