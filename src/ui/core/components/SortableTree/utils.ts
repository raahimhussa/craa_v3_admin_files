import {
  FlatDataItem,
  getFlatDataFromTree,
  getNodeAtPath,
  TreeItem,
} from '@nosferatu500/react-sortable-tree'

export const getTreeFromFlatData = ({
  flatData,
  getKey = (flatDataItem: any) => {
    return flatDataItem.node?.id
  },
  getParentKey = (flatDataItem: FlatDataItem) => {
    return flatDataItem.parentNode?.id || '0'
  },
  rootKey = '0',
}: {
  flatData: FlatDataItem[]
  getKey?: (flatDataItem: FlatDataItem) => any
  getParentKey?: (flatDataItem: FlatDataItem) => any
  rootKey?: string
}) => {
  if (!flatData) {
    return []
  }

  const childrenToParents: Record<string, any> = {}

  for (const child of flatData) {
    const parentKey = getParentKey(child)
    if (parentKey in childrenToParents) {
      childrenToParents[parentKey].push(child)
    } else {
      childrenToParents[parentKey] = [child]
    }
  }

  if (!(rootKey in childrenToParents)) {
    return []
  }

  const trav = (parent: FlatDataItem) => {
    const parentKey = getKey(parent)
    if (parentKey in childrenToParents) {
      return Object.assign(Object.assign({}, parent), {
        children: childrenToParents[parentKey].map((child: FlatDataItem) =>
          trav(child)
        ),
      })
    }
    return Object.assign({}, parent)
  }
  return childrenToParents[rootKey].map((child: FlatDataItem) => trav(child))
}

export const flatNodeItems = (treeData: TreeItem[]) => {
  const getNodeKey = ({ node }: any) => node.id
  const flatData = getFlatDataFromTree({ treeData, getNodeKey })
  let result = []
  result = flatData.map(
    (item) =>
      getNodeAtPath({ treeData: treeData, path: item.path, getNodeKey })?.node
  )
  return result
}

export function makeId(length: number) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
