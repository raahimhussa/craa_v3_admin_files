import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import { ChromePicker, CompactPicker, SketchPicker } from 'react-color'
import { Delete, MoreVert } from '@mui/icons-material'
import { green, red } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'

import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import Folder from 'src/models/folder'
import { GenerateNodePropsParams } from 'src/ui/core/components/SortableTree/types'
import axios from 'axios'
import { toJS } from 'mobx'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import { AdminLogScreen } from 'src/utils/status'
// import { useUser } from '@hooks'

const TreeButtons = (
  props: GenerateNodePropsParams & {
    simDocsMutate: any
    foldersMutate: any
    simulationsMutate: any
    setRecentlyAddedNodeId: any
    simDocs: any
    folders: any
    selectedSimulationId: string
    dataBySimulation: any
    selectedSimulation: any
    // updateTree: () => void
  }
) => {
  
  const adminLogManager = AdminLogManager.getInstance();

  const { folderStore, findingStore } = useRootStore()
  const state: {
    anchorEl: any
    open: boolean
  } = useLocalObservable(() => ({
    open: false,
    anchorEl: null,
  }))
  const { enqueueSnackbar } = useSnackbar()
  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState<boolean>(false)
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false)
  const [selectedColor, setSelectedColor] = useState<any>(props.node.color)

  const handleDeleteDialogueOpen = () => {
    setDeleteDialogueOpen(true)
  }

  const handleDeleteDialogueClose = (e: any) => {
    e.stopPropagation()
    setDeleteDialogueOpen(false)
  }

  const changeColor = async (color: any) => {
    try {
      const data = await axios.patch('/v2/folders', {
        filter: {
          _id: props.node._id,
        },
        update: {
          color: color,
        },
      })
      props.foldersMutate()
    } catch (error) {
      console.log(error)
    }
  }

  const handleMenuItemClick = async (item: any) => {
    if(item.name === 'Copy To') {
      // console.log("handleMenuItemClick: ", props)
      if(props.node.depth > 0) {
        enqueueSnackbar('Only top folders are allowed to copy for now.', { variant: 'warning'})
        folderStore.selectedFolder = null
        return;
      }

      folderStore.resetForm()
      folderStore.selectedFolder = props.node;
      findingStore.selectedSimDoc = null;
      
      console.log("handleMenuItemClick: ", folderStore.selectedFolder);

      state.open = false
    }
    else if(item.name === 'Delete') {
      handleDeleteDialogueOpen()
    }
    else if(item.name === 'Activate') {
      // console.log("Activate from TreeButtons: ", props);
      const isFolder = props.node instanceof Folder
      if (isFolder) {
        if (
          props.simDocs.find(
            (doc: any) => doc.folderId === props.node._id
          ) === undefined &&
          props.folders.find(
            (folder: any) =>
              folder.folderId === props.node._id
          ) === undefined
        ) {
          enqueueSnackbar(
            'At leaset one document must be activated before activating this folder',
            { variant: 'error' }
          )
          return
        } else {
          const docs = props.simDocs.filter(
            (doc: any) => doc.folderId === props.node._id
          )
          const folders = props.folders.filter(
            (folder: any) =>
              folder.folderId === props.node._id
          )
          if (
            docs !== undefined &&
            docs.find(
              (doc: any) => doc.isActivated === true
            ) === undefined &&
            folders !== undefined &&
            folders.find(
              (folder: any) => folder.isActivated === true
            ) === undefined
          ) {
            enqueueSnackbar(
              'At leaset one document must be activated before activating this folder',
              { variant: 'error' }
            )
            return
          }
        }
      } else {                                                    
        if (!props.node.kind.includes("Medication") && props.node.files.length === 0) {
          enqueueSnackbar(
            'Document resource must be assigned before activating this document.',
            { variant: 'error' }
          )
          return
        }
      }
      state.open = false
      const nodeId = await item.onClick(props)
      if (item.isCreate) {
        props.setRecentlyAddedNodeId(nodeId)
      }
    }
    else {
      state.open = false
      const nodeId = await item.onClick(props)
      if (item.isCreate) {
        props.setRecentlyAddedNodeId(nodeId)
      }
      // await props.updateTree()
    }
  }

  const handleMenuClose = () => {
    state.open = false;
  }

  return (
    <>
      <CssBaseline />
      {props.node instanceof Folder && props.node.depth === 0 ? (
        <Button
          sx={{
            width: '20px',
            height: '20px !important',
            bgcolor: selectedColor,
            minWidth: '20px',
            border: '1px solid #cccccc',
            '&:hover': {
              bgcolor: selectedColor,
            },
          }}
          onClick={() => {
            setColorPickerOpen(!colorPickerOpen)
          }}
          disabled={!props.node.isActivated}
        ></Button>
      ) : (
        <></>
      )}
      {colorPickerOpen ? (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 20,
            right: 0,
          }}
        >
          <ChromePicker
            color={selectedColor}
            onChangeComplete={(color) => {
              setSelectedColor(color.hex)
              changeColor(color.hex)
            }}
          />
        </Box>
      ) : (
        <></>
      )}
      <IconButton
        onClick={(e) => {
          state.anchorEl = e.currentTarget
          state.open = !state.open
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        onClose={handleMenuClose}
        anchorEl={state.anchorEl}
        open={state.open}
        MenuListProps={{ onMouseLeave: handleMenuClose}}
      >
        {folderStore
          .menuItems(
            props.node.isActivated,
            props.simDocsMutate,
            props.foldersMutate,
            props.simulationsMutate,
            props.simDocs,
            props.folders,            
          )
          .filter((item) => {
            if (props.lowerSiblingCounts.length < 2) return true
            if (item.name !== 'New Folder') return true
            return false
          })
          ?.map((item) => {
            const folderFilterTypes = ['all', 'folder']
            const documentFilterTypes = ['all', 'document']

            const isFolder = props.node instanceof Folder

            if (isFolder) {
              if (!folderFilterTypes.includes(item.type)) {
                return null
              }
            } else {
              if (!documentFilterTypes.includes(item.type)) {
                return null
              }
            }
            return (
              <MenuItem
                sx={{ 
                  color: item.name === 'Delete' ? red[900] : green[900], 
                  height: isFolder && item.name === 'Divider' ? '1px !important' : 0,
                  display:  !isFolder && item.name === 'Divider' ? 'none' : 'block'
                }}                
                onClick={async () => handleMenuItemClick(item)}
                key={uniqid()}
              >                
                {isFolder && item.name === 'Divider' ? <Divider sx={{width: 100}} /> : (item.name !== 'Divider' ? item.name : null)}                
                {item.name === 'Delete' ? (
                  <DeleteDialogue
                    open={deleteDialogueOpen}
                    handleClose={handleDeleteDialogueClose}
                    onDelete={async () => {
                      state.open = false
                      await item.onClick(props)
                      if (props.node._id === findingStore.selectedSimDoc?._id) {
                        findingStore.selectedSimDoc = null                        
                      } else {
                        //FIXME - when folder is deleted
                        findingStore.selectedSimDoc = null
                        // console.log("deleted: ", props.node);
                        // if(props.node._id) {
                          
                        //   adminLogManager?.createDeleteLog({
                        //     screen: AdminLogScreen.SimResources,
                        //     target: {
                        //       type: AdminLogTargetType.SimResources,   
                        //       _type: 'doc',       
                        //       _id: props.node._id || null,
                        //       sid: '',
                        //       sname: '',
                        //       origin: props.node.title || '',                
                        //       message: 'Doc deleted',
                        //       _key: 'doc_del'
                        //     },
                        //     resource: {
                        //       // ...this.form,
                        //     },
                        //   })             
                        // }                                                
                      }
                      // await props.updateTree()
                    }}
                    title={`Are you sure you want to delete ${
                      props.node.title
                        ? `"${
                            props.node.title.length > 20
                              ? props.node.title.substring(0, 20) + '...'
                              : props.node.title
                          }"`
                        : 'item'
                    }?`}
                    text={
                      "This item will be deleted permanently. You can't undo this action."
                    }
                    yesText={'Delete'}
                    noText={'Cancel'}
                  />
                ) : null}
              </MenuItem>
            )
          })}
      </Menu>
    </>
  )
}

export default observer(TreeButtons)
