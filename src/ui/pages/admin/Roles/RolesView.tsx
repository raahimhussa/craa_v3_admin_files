import Roles from 'src/ui/core/components/tables/Roles/Roles'
import { observer } from 'mobx-react'
function RolesView({ roles, rolesMutate }: any) {
  return (
    <Roles
      buttons={false}
      roles={roles}
      rolesMutate={rolesMutate}
    />
  )
}
export default observer(RolesView)
