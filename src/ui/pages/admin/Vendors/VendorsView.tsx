import Vendors from 'src/ui/core/components/tables/Vendors/Vendors'
import { observer } from 'mobx-react'
function VendorsView({ vendors, vendorsMutate }: any) {
  return (
    <Vendors
      buttons={false}
      vendors={vendors}
      vendorsMutate={vendorsMutate}
    />)
}
export default observer(VendorsView)