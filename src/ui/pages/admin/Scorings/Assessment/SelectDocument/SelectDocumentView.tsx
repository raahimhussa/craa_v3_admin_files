import '@szhsin/react-menu/dist/index.css'

import { Menu, MenuItem, SubMenu } from '@szhsin/react-menu'
import { observer, useLocalObservable } from 'mobx-react'

// import PDF from 'src/ui/core/components/PDF/PDF'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IFolder from 'src/models/folder/folder.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import PDFViewer from '../AssessmentTopBar/PDFViewer/PDFViewer'
import compose from '@shopify/react-compose'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { withFind } from '@hocs'

function SelectDocumentView({
  folders,
  onClickOpenPDF,
}: {
  folders: IFolder[]
  onClickOpenPDF: (simDoc: ISimDoc) => void
}) {
  const state: {
    isOpen: boolean
    anchorEl: HTMLButtonElement | null
  } = useLocalObservable(() => ({
    isOpen: false,
    anchorEl: null,
  }))
  return (
    <>
      <Menu
        menuButton={
          <Button sx={{ height: 40 }} variant="outlined">
            Select Document
          </Button>
        }
      >
        {folders.map((folder) => {
          return (
            <Folder
              key={uniqid()}
              folder={folder}
              onClickOpenPDF={onClickOpenPDF}
            />
          )
        })}
      </Menu>
    </>
  )
}

const FolderView = observer(
  ({
    folder,
    simDocs,
    folders,
    onClickOpenPDF,
  }: {
    folder: IFolder
    simDocs: ISimDoc[]
    folders: IFolder[]
    onClickOpenPDF: (simDoc: ISimDoc) => void
  }) => {
    return (
      <SubMenu label={folder.name}>
        {folders.map((folder) => (
          <Folder
            key={uniqid()}
            folder={folder}
            onClickOpenPDF={onClickOpenPDF}
          />
        ))}
        {simDocs.map((simDoc) => (
          <Document
            key={uniqid()}
            simDoc={simDoc}
            onClickOpenPDF={onClickOpenPDF}
          />
        ))}
      </SubMenu>
    )
  }
)

const Folder = compose<any>(
  withFind({
    collectionName: 'simDocs',
    getFilter: (props: any) => ({
      folderId: props.folder._id,
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'folders',
    getFilter: (props: any) => ({
      folderId: props.folder._id,
      isDeleted: false,
    }),
    version: 2,
  })
)(FolderView)

const Document = observer(
  ({
    simDoc,
    onClickOpenPDF,
  }: {
    simDoc: ISimDoc
    onClickOpenPDF: (simDoc: ISimDoc) => void
  }) => {
    const onClick = () => {
      onClickOpenPDF(simDoc)
    }

    return <MenuItem onClick={onClick}>{simDoc.title}</MenuItem>
  }
)

export default observer(SelectDocumentView)
