import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { Box, Button } from '@mui/material'

import CellButtons from '@components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import IFile from 'src/models/file/file.interface'
import PDFViewer from '../SimDocs/Finding/SelectedDocument/PDFViewer/PDFViewer'
import Uploader from '@components/Uploader/Uploader'
import { Utils } from '@utils'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
    const {
      uiState: { modal },
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
        Header: 'Filename',
        accessor: 'name',
        type: Type.String,
        collectionName: 'files',
        minWidth: 400,
        maxWidth: 700,
        Cell: (cellProps: any) => {
          return highlightedText(
            cellProps.value,
            props?.params?.options?.fields?.searchString || ''
          )
        },
      },
      {
        Header: 'type',
        accessor: 'mimeType',
        type: Type.String,
        collectionName: 'files',
        // cellType: CellType.Editable,
        minWidth: 200,
        maxWidth: 700,
      },
      {
        Header: 'size',
        accessor: 'size',
        type: Type.String,
        Cell: (cellProps: CellProps<IFile>) => {
          const fileSize = cellProps.row.original.size || 0
          let convertedFileSize = ''
          if (Utils.bytesToKiloBytes(fileSize) > 1023) {
            convertedFileSize =
              Utils.bytesToMegaBytes(fileSize).toFixed(1) + ' MB'
          } else {
            convertedFileSize =
              Utils.bytesToKiloBytes(fileSize).toFixed(0) + ' KB'
          }
          return <div>{convertedFileSize}</div>
        },
        minWidth: 200,
        maxWidth: 700,
      },
      {
        Header: 'Added Date',
        accessor: 'createdAt',
        type: Type.Date,
        cellType: CellType.Date,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        Header: 'PDF',
        accessor: 'url',
        Cell: (cellProps: CellProps<IFile>) => {
          const onClickView = () => {
            modal.open(
              'ViewFile',
              <PDFViewer fileUrl={cellProps.row.original.url} />
            )
          }
          return <Button onClick={onClickView}>View</Button>
        },
        minWidth: 200,
        maxWidth: 200,
      },
      {
        Header: 'Action',
        accessor: '_id',
        collectionName: 'files',
        Cell: CellButtons,
        storeKey: 'fileStore',
        mutateKey: 'files',
        edit: (_props) => {
          modal.open('Uploader', <Uploader fileId={_props.row.original._id} />)
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
