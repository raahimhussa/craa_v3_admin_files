import Policies from 'src/ui/core/components/tables/Policies/Policies'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'
function PoliciesView({ policies, policiesMutate }: any) {
  const { policyStore } = useRootStore()
  useEffect(() => {
    policyStore.mutate = policiesMutate
  }, [])


  return <Policies policies={policies} policiesMutate={policiesMutate} />
}
export default observer(PoliciesView)
