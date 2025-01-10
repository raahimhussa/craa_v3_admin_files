import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { AdminLogScreen } from 'src/utils/status'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Domain from './columns/Domain/Domain'
import KeyConcept from 'src/ui/pages/admin/KeyConcept/KeyConcept'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Text',
        accessor: 'description',
        type: Type.String,
        minWidth: 300,
      },
      {
        Header: 'Domain',
        accessor: 'domainId',
        // type: Type.String,
        Cell: (props: any) => {
          return <Domain value={props.value} />
        },
      },
      {
        Header: 'Actions',
        collectionName: 'keyConcepts',
        storeKey: 'keyConceptStore',
        mutateKey: 'keyConcepts',
        Cell: CellButtons,
        screen: AdminLogScreen.KeyConcepts,
        minWidth: 150,
        edit: () => {
          modal.open(
            'KeyConcept',
            <KeyConcept selectedDomainId={props.selectedDomainId} />
          )
        },
      },
    ]

    const meta = {
      columns: props.isSubTable
        ? columns.filter((column) => column.Header !== 'Domain')
        : columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
