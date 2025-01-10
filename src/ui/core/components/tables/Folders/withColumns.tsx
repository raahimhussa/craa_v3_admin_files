import { Box, Button } from 'src/ui/core/components'
import CellHeaderExpander from 'src/ui/core/components/cells/CellHeaderExpander/CellHeaderExpander'
import CellSubFolderExpander from 'src/ui/core/components/cells/CellSubFolderExpander/CellSubFolderExpander'
import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import SubFolders from 'src/ui/core/components/subComponents/SubFolders/SubFolders'
import { FileOpen, Folder } from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { CellProps } from 'react-table'
import { useRootStore } from 'src/stores'
const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
    const { modalStore } = useRootStore()
    const onClickAddFolder = (kind: string, row: any) => {
      const folder = row.original
      const depth = row.original.depth + 1
      modalStore.folder.isVisible = true
      modalStore.folder.payload = {
        folder: {
          parentId: folder._id,
          kind: kind,
          depth: depth,
        },
      }
      if (kind === 'FileFolder') {
        modalStore.folder.payload.folder.docs = []
      }
    }

    const columns: Array<AdminColumn> = [
      // {
      //   Header: CellHeaderExpander,
      //   cellType: CellType.SubComponent,
      //   Cell: CellSubFolderExpander,
      //   renderRowSubComponent: ({ row }: any) => <SubFolders row={row} />,
      //   minWidth: 20,
      //   width: 140,
      //   maxWidth: 200,
      // },
      {
        Header: 'Name',
        accessor: 'name',
        type: Type.String,
        cellType: CellType.Expander,
        collectionName: 'folders',
        minWidth: 400,
        maxWidth: 700,
        Cell: (cell: CellProps<any>) => {
          if (cell.row.original.kind != 'FileFolder') {
            return <div>{cell.row.original.name}</div>
          } else {
            return (
              <div>
                <div>{cell.row.original?.name}</div>
                <div>
                  {cell.row.original?.files?.length > 0 &&
                    cell.row.original?.files?.map((file: any) => {
                      return <Box sx={{ bgcolor: grey[100] }}>{file.name}</Box>
                    })}
                </div>
              </div>
            )
          }
        },
      },
      {
        Header: 'Date Added',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 200,
        maxWidth: 400,
      },
      {
        id: 'add folder',
        type: Type.String,
        Cell: ({ row }: any) => {
          if (row.original.depth > 1) return null
          return (
            <Button
              sx={{
                height: 24,
              }}
              onClick={() => onClickAddFolder('DocFolder', row)}
              startIcon={<Folder />}
            >
              Add
            </Button>
          )
        },
        minWidth: 100,
        maxWidth: 100,
      },
      {
        id: 'add doc',
        type: Type.String,
        Cell: ({ row }: any) => {
          if (row.original.kind === 'FileFolder') {
            return null
          }
          return (
            <Button
              onClick={() => onClickAddFolder('FileFolder', row)}
              sx={{ height: 24 }}
              startIcon={<FileOpen />}
            >
              Add
            </Button>
          )
        },
        minWidth: 100,
        maxWidth: 100,
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
