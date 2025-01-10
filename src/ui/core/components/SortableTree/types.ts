import { GetTreeItemChildrenFn } from '@nosferatu500/react-sortable-tree'
import { ReactNode } from 'react'

export declare type OnMoveNodeParams = {
  treeData: any[]
  node: any
  nextParentNode: any
  prevPath: number[]
  prevTreeIndex: number
  nextPath: number[]
  nextTreeIndex: number
}

export declare type GenerateNodePropsParams = {
  node: any
  path: number[]
  treeIndex: number
  lowerSiblingCounts: number[]
  isSearchMatch: boolean
  isSearchFocus: boolean
  parentNode?: TreeItem
  simDocs: any
  folders: any
  dataBySimulation: any
  selectedSimulationId: string
  selectedSimulation: any
}

export declare type TreeItem = {
  id?: string | number | null
  kind?: TreeItemKind
  files?: Array<any>
  title?: ReactNode | undefined
  subtitle?: ReactNode | undefined
  expanded?: boolean | undefined
  children?: TreeItem[] | GetTreeItemChildrenFn | undefined
  [x: string]: any
}

export type SortableTreeLocalState = {
  isFolder: boolean
  maxDepth?: number
  treeData: TreeItem[]
  treeItem: TreeItem
}

export enum TreeItemKind {
  Document = 'document',
  Folder = 'folder',
}
