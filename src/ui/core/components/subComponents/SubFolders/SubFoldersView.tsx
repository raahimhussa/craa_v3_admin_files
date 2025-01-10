import Folders from 'src/ui/core/components/tables/Folders/Folders'
import { observer } from 'mobx-react'
import { SubFolderViewProps } from './SubFolders'
function SubFoldersView(props: SubFolderViewProps) {
  const { folders = [], row } = props
  return <Folders buttons={false} header={false} folders={folders} />
}
export default observer(SubFoldersView)
