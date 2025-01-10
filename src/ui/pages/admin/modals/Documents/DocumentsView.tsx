import Files from 'src/ui/core/components/tables/Files/Files'
import { observer } from 'mobx-react'
function DocumentsView({ files }: any) {
  return <Files files={files} />
}
export default observer(DocumentsView)
