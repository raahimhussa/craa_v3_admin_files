import Domains from 'src/ui/core/components/tables/Domains/Domains'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
function DomainsView({ domains, domainsMutate, isSubTable, parentId }: any) {
  return (
    <Domains
      isSubTable={isSubTable}
      parentId={parentId ? parentId : null}
      buttons={isSubTable ? false : true}
      domains={domains}
      domainsMutate={domainsMutate}
    />
  )
}
export default observer(DomainsView)
