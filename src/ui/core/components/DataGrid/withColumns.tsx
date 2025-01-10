import CellExpander from 'src/ui/core/components/cells/CellExpander/CellExpander'
import CellHeaderExpander from 'src/ui/core/components/cells/CellHeaderExpander/CellHeaderExpander'
import CellInput from 'src/ui/core/components/cells/CellInput/CelInput'
import CellSubCompExpander from 'src/ui/core/components/cells/CellSubCompExpander/CellSubCompExpander'
import CellTimestamp from 'src/ui/core/components/cells/CellTimestamp/CellTimestamp'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { AdminColumn, CellType } from './DataGrid'
import _ from 'lodash'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { columns }: { columns: Array<AdminColumn> } = props
    const _columns = _.cloneDeep(columns)
    let renderRowSubComponent = null

    _columns?.forEach((column: AdminColumn, index) => {
      switch (column.cellType) {
        case CellType.Editable:
          column.Cell = CellInput
          break
        case CellType.Expander:
          column.id = 'expander' + index
          column.Cell = column.Cell || CellExpander
          column.Header = column.Header || CellHeaderExpander
          break
        case CellType.SubComponent:
          column.id = 'subComponent' + index
          column.Cell = column.Cell || CellSubCompExpander
          renderRowSubComponent = column.renderRowSubComponent
          break
        case CellType.Date:
          column.Cell = column.Cell || CellTimestamp
          break
      }
    })

    return (
      <WrappedComponent
        {...props}
        columns={_columns}
        renderRowSubComponent={renderRowSubComponent}
      />
    )
  })

export default withColumns
