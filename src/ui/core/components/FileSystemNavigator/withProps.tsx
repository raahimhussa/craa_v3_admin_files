import _ from 'lodash'
import { observer } from 'mobx-react'
import { FileSystemNavigatorViewProps } from './FileSystemNavigator'
const withProps = (WrappedComponent: any) =>
  observer((props: FileSystemNavigatorViewProps) => {
    const { folders, depthOneFolders, depthTwoFolders } = props

    const _folders = [...folders]

    _folders.forEach((folder) => {
      const depthOneFoldersFilteredById = depthOneFolders.filter(
        (depthOneFolder: any) => depthOneFolder.parentId === folder._id
      )

      folder.subFolders = depthOneFoldersFilteredById

      depthOneFoldersFilteredById.forEach((depthOneFolderFilteredById: any) => {
        const depthTwoFoldersFilteredById = depthTwoFolders.filter(
          (depthTwoFolder: any) => depthOneFolderFilteredById._id === depthTwoFolder.parentId
        )
        depthOneFolderFilteredById.subFolders = depthTwoFoldersFilteredById
      })
    })

    return <WrappedComponent {...props} folders={_folders} />
  })

export default withProps
