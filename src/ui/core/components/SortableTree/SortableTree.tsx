import '@nosferatu500/react-sortable-tree/style.css'
import './style.css'

import { ReactSortableTreeProps } from '@nosferatu500/react-sortable-tree/react-sortable-tree'
import SortableTree from '@nosferatu500/react-sortable-tree'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useState } from 'react'

function SortableTreeView(props: ReactSortableTreeProps) {
  const { style } = props
  const defaultStyle = {
    height: 700,
    ...style,
  }
  const treeData = _.cloneDeep(props.treeData)
  const getNodeKey = ({ node }: any) => node._id
  return (
    <SortableTree
      {...props}
      getNodeKey={getNodeKey}
      treeData={treeData}
      style={defaultStyle}
      maxDepth={3}
    />
  )
}

export default observer(SortableTreeView)
