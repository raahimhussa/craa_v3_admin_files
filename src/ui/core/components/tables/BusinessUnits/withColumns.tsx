import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { AdminLogScreen } from 'src/utils/status'
import BusinessUnit from 'src/ui/pages/admin/BusinessUnit/BusinessUnit'
import CellAutocomplete from 'src/ui/core/components/cells/CellAutocomplete/CellAutocomplete'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { UpdateType } from 'src/stores/clientUnitStore'
import { WrappingFunction } from '@shopify/react-compose'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
      clientUnitStore,
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'BUName',
        accessor: 'name',
        type: Type.String,
        collectionName: 'businessUnits',
        cellType: CellType.Editable,
      },
      {
        Header: 'Country-BU',
        accessor: 'countryIds',
        collectionName: 'businessUnits',
        optionCollectionName: 'countries',
        optionTextField: 'name',
        Cell: CellAutocomplete,
      },
      {
        Header: 'Country-Permission',
        accessor: 'adminCountryIds',
        collectionName: 'businessUnits',
        optionCollectionName: 'countries',
        optionTextField: 'name',
        Cell: CellAutocomplete,
      },
      {
        Header: 'Actions',
        Cell: CellButtons,
        storeKey: 'clientUnitStore',
        mutateKey: 'clientUnits',
        screen: AdminLogScreen.Clients,
        edit: ({ row }) => {
          clientUnitStore.form = props.clientUnit
          clientUnitStore.businessUnitForm = row.original
          clientUnitStore.updateType = UpdateType.BusinessUnit
          clientUnitStore.mutate = props.clientUnitsMutate
          modal.open('BusinessUnit', <BusinessUnit />)
        },
        remove: ({ row }) => {
          clientUnitStore.form = props.clientUnit
          clientUnitStore.removeBusinessUnit(row.index)
          clientUnitStore.update()
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
