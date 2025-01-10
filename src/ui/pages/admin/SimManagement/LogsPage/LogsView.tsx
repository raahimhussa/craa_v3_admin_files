import Logs from 'src/ui/core/components/tables/LogsTable/Logs'
import { observer } from 'mobx-react'
// @ts-ignore
function LogsView(props) {
  return <Logs {...props} buttons={false} />
}
export default observer(LogsView)
