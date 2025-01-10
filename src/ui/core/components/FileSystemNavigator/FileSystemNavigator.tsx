import { withFind } from '@hocs'
import compose from '@shopify/react-compose'
import FileSystemNavigatorView from './FileSystemNavigatorView'
import withProps from './withProps'
export type FileSystemNavigatorProps = {
  folders: Array<any>
}
export type HocComponentProps = {
  depthOneFolders: any
  depthTwoFolders: any
}
export type FileSystemNavigatorViewProps = FileSystemNavigatorProps & HocComponentProps

export type Folder = {
  _id: string
}

const getDepthOneFilter = (props: FileSystemNavigatorProps & HocComponentProps) => {
  const { folders } = props
  const folderIds = folders.map((folder: Folder) => folder._id)

  return {
    parentId: {
      $in: folderIds,
    },
  }
}

const getDepthTwoFilter = (props: HocComponentProps) => {
  const { depthOneFolders } = props
  const folderIds = depthOneFolders.map((folder: Folder) => folder._id)
  return {
    parentId: {
      $in: folderIds,
    },
  }
}

export default compose<FileSystemNavigatorProps>(
  withFind({
    collectionName: 'folders',
    getFilter: getDepthOneFilter,
    propName: 'depthOneFolders',
  }),
  withFind({
    collectionName: 'folders',
    getFilter: getDepthTwoFilter,
    propName: 'depthTwoFolders',
  }),
  withProps
)(FileSystemNavigatorView)
