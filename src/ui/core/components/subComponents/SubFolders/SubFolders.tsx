import { withFind } from '@hocs'
import compose from '@shopify/react-compose'
import { Row } from 'react-table'
import SubFolderView from './SubFoldersView'

export type SubFolderProps = {
  row: Row
}
export type HocComponent = {
  folders: Array<any>
}
export type SubFolderViewProps = SubFolderProps & HocComponent

const getFilter = (props: SubFolderProps) => {
  const { row } = props
  const folder: any = row.original

  return {
    parentId: folder._id,
  }
}

export default compose<SubFolderProps>(
  withFind({
    collectionName: 'folders',
    getFilter,
  })
)(SubFolderView)
