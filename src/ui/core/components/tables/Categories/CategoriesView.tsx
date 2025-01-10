import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function CategoriesView({ categories, columns, state, leftButtons, rightButtons }: any) {
  return (
    <DataGrid
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={categories}
    />
  )
}
export default observer(CategoriesView)
