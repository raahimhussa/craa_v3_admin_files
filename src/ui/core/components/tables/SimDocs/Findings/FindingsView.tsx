import Findings from 'src/ui/core/components/tables/Findings/Findings'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
// @ts-ignore
function FindingsView(props) {
  return <Findings {...props} />
}
export default observer(FindingsView)
