import { observer } from 'mobx-react'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import _ from 'lodash'
import SortableTree from 'src/ui/core/components/SortableTree/SortableTree'
import axios from 'axios'

function CategoryView({ state }: any) {
  // const onClickRemove = (isRootNode: boolean, nodeId: number) => {
  //   // if (!params.parentNode) {
  //   //   try {
  //   //     await axios.delete(`v1/simDocs/${node._id}`)
  //   //     dialogStore.success()
  //   //   } catch (error) {
  //   //     dialogStore.failure()
  //   //   }
  //   // }
  // }

  return (
    <></>
    // <DetailLayout collectionName="categories" document={{ ...state.category }}>
    //   <SortableTree
    //     state={state}
    //     path='category.items'
    //     treeData={[]}
    //     onChange={function (treeData: any): void {
    //       throw new Error('Function not implemented.')
    //     }}
    //     onRemove={undefined}
    //   />
    // </DetailLayout>
  )
}
export default observer(CategoryView)
