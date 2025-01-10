import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Domain from './columns/Domain/Domain'
import KeyConcept from 'src/ui/pages/admin/KeyConcept/KeyConcept'
import KeyConcepts from '@components/tables/KeyConcepts/KeyConcepts'
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
        Header: 'keyConcepts',
        accessor: '_id',
        cellType: CellType.SubComponent,
        renderRowSubComponent: ({ row }: any) => {
          return (
            <KeyConcepts
              keyConcepts={props.keyConcepts.filter(
                (keyConcept: any) => keyConcept.domainId === row.original._id
              )}
              isSubTable={true}
              selectedDomainId={row.original._id}
            />
          )
        },
      },
      {
        Header: 'Domain',
        accessor: 'name',
        type: Type.String,
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
