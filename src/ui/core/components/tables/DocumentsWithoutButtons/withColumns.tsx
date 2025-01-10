import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { Box, Button, IconButton } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import CellButtons from '@components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import DocumentBuilder from '@components/DocumentBuilder/DocumentBuilder'
import Preview from '@components/DocumentBuilder/Preivew'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import palette from 'src/theme/palette'
import { IDocument } from 'src/models/document/types'
import DocumentPage from 'src/models/documentPage'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
    const {
      uiState: { modal },
      documentStore,
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
        Header: 'Title',
        accessor: 'title',
        type: Type.String,
        collectionName: 'files',
        minWidth: 400,
        maxWidth: 1000,
        width: 1000,
        Cell: (cellProps: any) => {
          return highlightedText(
            cellProps.value,
            props?.params?.options?.fields?.searchString || ''
          )
        },
      },
      {
        Header: 'Pages',
        accessor: 'pages',
        type: Type.Date,
        cellType: CellType.Date,
        minWidth: 200,
        maxWidth: 200,
        Cell: (cellProps: any) => {
          return cellProps.row.original.versions[
            cellProps.row.original.versions.length - 1
          ][
            cellProps.row.original.versions[
              cellProps.row.original.versions.length - 1
            ].length - 1
          ].pages.length
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
        Header: 'Preview',
        accessor: '',
        maxWidth: 40,
        width: 40,
        Cell: (cellProps: CellProps<IDocument>) => {
          const onClickView = () => {
            // let pages: DocumentPage[] = []
            // Promise.all(
            //   cellProps.row.original.pages.map((page: string) => {
            //     const params = {
            //       filter: {
            //         _id: page,
            //       },
            //     }
            //     axios.get('/v1/documentPages', { params }).then((res) => {
            //       pages.push(res.data[0])
            //     })
            //   })
            // )
            //@ts-ignore
            modal.open('Preview', <Preview document={cellProps.row.original} />)
          }
          return (
            <IconButton
              onClick={onClickView}
              sx={{
                mr: 1,
              }}
            >
              <RemoveRedEyeIcon htmlColor={palette.light.button.dark} />
            </IconButton>
          )
        },
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
