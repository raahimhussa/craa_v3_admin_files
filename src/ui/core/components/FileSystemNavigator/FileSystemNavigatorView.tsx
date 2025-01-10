import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TreeItem from '@mui/lab/TreeItem'
import { observer } from 'mobx-react-lite'
import { FileSystemNavigatorViewProps } from './FileSystemNavigator'
import uniqid from 'uniqid'

function FileSystemNavigatorView(props: FileSystemNavigatorViewProps) {
  const { folders } = props

  const renderTree = (item: any) => {
    return (
      <TreeItem key={uniqid()} nodeId={uniqid()} label={item.name}>
        {item.subFolders?.length > 0 && item.subFolders.map(renderTree)}
      </TreeItem>
    )
  }

  // const renderTrees = (item: any) => {
  //   if (item.subFolders.length > 0) {
  //     return null
  //   }
  //   return renderTree(item)
  // }

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {folders.map(renderTree)}
      {/* {folders.map((folder) => {
        return (
          <TreeItem key={uniqid()} nodeId={uniqid()} label={folder.name}>
            {folder.subFolders?.length > 0 && folder.subFolders.map(renderTree)}
          </TreeItem>
        )
      })} */}
    </TreeView>
  )
}

export default observer(FileSystemNavigatorView)
