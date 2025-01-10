import Agreements from 'src/ui/core/components/tables/Agreements/Agreements'
import { observer } from 'mobx-react'
import IAgreement from 'src/models/agreement/agreement.interface'
function AgreementsView({
  agreements
}: {
  agreements: IAgreement[]
}) {
  return <Agreements agreements={agreements} />
}
export default observer(AgreementsView)
