import Domains from './Domains/Domains'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
function KeyConceptsView({ domains, keyConcepts, ...rest }: any) {
  return <Domains {...rest} domains={domains} keyConcepts={keyConcepts} />
}
export default observer(KeyConceptsView)
