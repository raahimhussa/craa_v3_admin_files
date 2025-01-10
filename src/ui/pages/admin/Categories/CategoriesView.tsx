import Categories from 'src/ui/core/components/tables/Categories/Categories'
import '@nosferatu500/react-sortable-tree/style.css'
import { observer } from 'mobx-react'
function CategoriesView({ categories }: any) {
  return <Categories categories={categories} />
}
export default observer(CategoriesView)
