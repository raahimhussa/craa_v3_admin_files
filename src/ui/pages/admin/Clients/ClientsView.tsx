import Clients from 'src/ui/core/components/tables/Clients/Clients'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'
function ClientsView({ clientUnits, clientUnitsMutate, countries }: any) {
  return (
    <PaginationTable
      collectionName={'clientUnits'}
      Table={Clients}
      params={{
        filter: {
          isDeleted: false,
          vendor: '',
        },
      }}
      version={1}
    />
    // <Clients
    //   clientUnits={clientUnits}
    //   clientUnitsMutate={clientUnitsMutate}
    //   countries={countries}
    // />
  )
}
export default observer(ClientsView)
