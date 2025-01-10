import BusinessUnits from 'src/ui/core/components/tables/BusinessUnits/BusinessUnits'
import { observer } from 'mobx-react'
function BusinessUnitsView({ countries, clientUnit, ...rest }: any) {
  return (
    <BusinessUnits
      {...rest}
      countries={countries}
      businessUnits={clientUnit.businessUnits}
      clientUnit={clientUnit}
    />
  )
}
export default observer(BusinessUnitsView)
