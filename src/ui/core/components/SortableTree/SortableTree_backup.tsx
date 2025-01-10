import '@nosferatu500/react-sortable-tree/style.css'
import './style.css'
import { observer, useLocalObservable } from 'mobx-react'
import SortableTree, {
  changeNodeAtPath,
  removeNodeAtPath,
} from '@nosferatu500/react-sortable-tree'
import Box from '@mui/material/Box'
import { reaction, toJS } from 'mobx'
import Button from '@mui/material/Button'
import { TextField } from 'src/ui/core/components'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import { Delete, Edit, FileCopy, Folder, Upload } from '@mui/icons-material'
import { ButtonGroup, FormLabel, Grid, Paper, Switch } from '@mui/material'
import red from '@mui/material/colors/red'
import { useRootStore } from 'src/stores'
import green from '@mui/material/colors/green'
import grey from '@mui/material/colors/grey'
import blue from '@mui/material/colors/blue'
import { MobxUtil } from '@utils'
import { brown } from '@mui/material/colors'
import {
  GenerateNodePropsParams,
  OnMoveNodeParams,
  SortableTreeLocalState,
  TreeItem,
  TreeItemKind,
} from './types'
import Swal from 'sweetalert2'
import { ReactSortableTreeProps } from '@nosferatu500/react-sortable-tree/react-sortable-tree'

function SortableTreeView(
  props: ReactSortableTreeProps & { state: any; path: string; onRemove: any }
) {
  const { state, path, onRemove = null } = props
  const { modalStore } = useRootStore()
  const localState: SortableTreeLocalState = useLocalObservable(() => ({
    isFolder: false,
    maxDepth: 2,
    treeData: MobxUtil._get(state, path),
    treeItem: {
      id: null,
      kind: TreeItemKind.Folder,
      title: '',
      children: [],
      files: [],
    },
  }))

  reaction(
    () => localState.treeData,
    () => {
      MobxUtil._set(state, path, localState.treeData)
    }
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.treeData = MobxUtil._get(state, path))
  )

  const onMoveNode = (params: OnMoveNodeParams) => {
    const treeData = params.treeData
    localState.treeData = treeData
  }

  const onChange = (treeData: any) => {
    localState.treeData = treeData
  }

  const onClickAdd = () => {
    const treeItem = toJS(localState.treeItem)
    treeItem.id = Date.now()
    treeItem.kind = localState.isFolder
      ? TreeItemKind.Folder
      : TreeItemKind.Document
    localState.treeData?.push(treeItem)
  }

  const getNodeKey = ({ node }: any) => node.id

  const onClickEdit = (params: GenerateNodePropsParams) => () => {
    const { node, path } = params
    const treeData = localState.treeData
    modalStore.categoryItem.isVisible = true
    modalStore.categoryItem.payload.categoryItem = node
    modalStore.categoryItem.payload.callback = (categoryItem: TreeItem) => {
      const result = changeNodeAtPath({
        treeData,
        path,
        newNode: categoryItem,
        getNodeKey,
      })
      localState.treeData = result
    }
  }

  const onClickRemove = (params: GenerateNodePropsParams) => async () => {
    const { path, node } = params
    /**
     * @function removeNodeAtPath
     * @param { treeData, path, getNodeKey, ignoreCollapsed, }
     */
    const isRootNode = !params.parentNode

    if (onRemove && isRootNode) {
      const result = await Swal.fire({
        title: 'Warning!',
        text: 'Are you sure you want to delete it ?',
        icon: 'warning',
        heightAuto: false,
        confirmButtonColor: green[500],
        confirmButtonText: 'Delete',
        denyButtonText: 'Cancel',
        showDenyButton: true,
      })

      if (result.isConfirmed) {
        try {
          await onRemove(node._id)
        } catch (error) {
          return null
        }
      }

      if (result.isDenied) {
        return null
      }
    } else {
      console.error('onRemove props not exist')
    }

    const treeData = removeNodeAtPath({
      treeData: localState.treeData,
      path,
      getNodeKey,
    })
    localState.treeData = treeData
  }

  const onClickUpload = (params: GenerateNodePropsParams) => () => {
    const node = params.node
    const path = params.path
    modalStore.fileSelect.isVisible = true
    modalStore.fileSelect.onClickSelect = (files: any) => {
      node.currentPage = 0
      node.totalPage = 0
      node.scale = 1
      node.files = files
      const result = changeNodeAtPath({
        treeData: localState.treeData,
        newNode: node,
        path,
        getNodeKey,
      })
      localState.treeData = result
    }
  }

  const onClickDocument = (params: GenerateNodePropsParams) => () => {
    modalStore.documents.isVisible = true
    modalStore.documents.payload.files = params.node.files
  }

  return (
    <Box
      sx={{
        p: 2,
        height: 700,
        border: 0,
        overflow: 'scroll',
      }}
    >
      <Grid container display={'flex'} justifyContent="space-evenly">
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Stack spacing={2}>
              <FormLabel>
                <Switch
                  onChange={(e, checked) => (localState.isFolder = checked)}
                  value={localState.isFolder}
                />
                {localState.isFolder ? 'Folder' : 'Doc'}
              </FormLabel>
              <TextField
                variant="outlined"
                label="Name"
                state={localState}
                path="treeItem.title"
              />
              <Button
                disabled={!localState.treeItem.title}
                size="small"
                variant="contained"
                sx={{ bgcolor: green[500] }}
                onClick={onClickAdd}
              >
                ADD
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={8} sx={{ height: 800 }}>
          <SortableTree
            {...props}
            style={{ flex: 1 }}
            className="my-sortable-tree"
            //@ts-ignore
            generateNodeProps={(params: GenerateNodePropsParams): any => {
              const node: TreeItem = params.node
              const isFolder = node.kind === 'folder'
              return {
                title: (
                  <>
                    {isFolder ? (
                      <IconButton size="small" disabled>
                        <Folder htmlColor={blue[500]} />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          size="small"
                          disabled={node.files?.length === 0}
                          onClick={onClickDocument(params)}
                        >
                          <FileCopy
                            htmlColor={
                              node.files!.length > 0 ? brown[400] : grey[500]
                            }
                          />
                        </IconButton>
                      </>
                    )}
                    <span>{params.node.title}</span>
                  </>
                ),
                buttons: [
                  <ButtonGroup>
                    {!isFolder && (
                      <IconButton onClick={onClickUpload(params)}>
                        <Upload />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={onClickEdit(params)}>
                      <Edit htmlColor={green[500]} />
                    </IconButton>
                    <IconButton size="small" onClick={onClickRemove(params)}>
                      <Delete htmlColor={red[500]} />
                    </IconButton>
                  </ButtonGroup>,
                ],
              }
            }}
            canDrag={() => false}
            getNodeKey={getNodeKey}
            maxDepth={3}
            onChange={onChange}
            treeData={toJS(localState.treeData)}
            onMoveNode={onMoveNode}
          />
        </Grid>
        <Grid xs={4} item>
          <Box></Box>
        </Grid>
      </Grid>
    </Box>
  )
}
export default observer(SortableTreeView)
