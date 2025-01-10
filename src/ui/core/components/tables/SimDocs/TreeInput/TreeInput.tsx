import React, { useEffect, useState, useRef } from 'react'

import FolderStore from 'src/stores/folderStore'
import { GenerateNodePropsParams } from '@components/SortableTree/types'
import { Tooltip } from '@mui/material'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import { AdminLogScreen } from 'src/utils/status'

type Props = {
  icon: JSX.Element | null
  params: GenerateNodePropsParams
  isFolder: boolean
  recentlyAddedNodeId: string
  selectedSimulationId: string  
  selectedSimulation: any  
}

export const TreeInput = (props: Props) => {
  const { icon, params, isFolder } = props
  const { folderStore, simDocStore } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const [focused, setFocused] = useState<boolean>(false)

  const [initialName, setInitialName] = useState<string>(''); // State to keep track of the initial label
  const [initialTitle, setInitialTitle] = useState<string>(''); // State to keep track of the initial label
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input    

  useEffect(() => {
    if (props.params.node._id === props.recentlyAddedNodeId) {
      setFocused(true)
    }
  }, [props.recentlyAddedNodeId])

  const onKeyPressEnter = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    params: GenerateNodePropsParams
  ) => {
    if (e.key === 'Enter') {
      if (params.node.store instanceof FolderStore) {
        await folderStore.update(params.node._id, {
          name: params.node.name ? params.node.name : 'Untitled folder',
        })
        if(params.node.label === '') {
          await folderStore.update(params.node._id, {
            label: 'unlabeled',
          })
        }

        if (params.node.name !== initialName) {
          enqueueSnackbar('Updated', { variant: 'success' })
          
          // console.log("TreeInput::onKeyPressEnter folder params: ", props, params, initialName)

          const logObj = {
            screen: AdminLogScreen.SimResources,
            target: {
              type: AdminLogTargetType.SimResources,   
              _type: 'folder',       
              _id: params.node._id || null,
              sid: props.selectedSimulationId,
              sname: props.selectedSimulation.name,
              origin: params.node.name,                
              message: 'folder updated',
              _key: 'folder_uptd'
            },
          }

          const adminLogManager = AdminLogManager.getInstance();
          adminLogManager?.createEditLog(logObj) 
                   
        } 
      } else {
        await simDocStore.update(params.node._id, {
          title: params.node.title ? params.node.title : 'Untitled document',
        })
        if(params.node.label === '') {
          await simDocStore.update(params.node._id, {
            label: 'unlabeled',
          })
        }
        if (params.node.title !== initialTitle) {
          enqueueSnackbar('Updated', { variant: 'success' })

          // console.log("TreeInput::onKeyPressEnter doc params: ", props, params, initialName)

          const logObj = {
            screen: AdminLogScreen.SimResources,
            target: {
              type: AdminLogTargetType.SimResources,   
              _type: 'doc',       
              _id: params.node._id || null,
              sid: props.selectedSimulationId,
              sname: props.selectedSimulation.name,
              origin: params.node.title,                
              message: 'doc updated',
              _key: 'doc_uptd',
              fname: params.parentNode?.name,
              fid: params.parentNode?._id,
            },
          }

          const adminLogManager = AdminLogManager.getInstance();
          adminLogManager?.createEditLog(logObj)           
        }                
      }

      inputRef.current?.blur();      
      
    }
  }

  const onBlur = async (params: GenerateNodePropsParams) => {
    if (params.node.store instanceof FolderStore) {
      await folderStore.update(params.node._id, {
        name: params.node.name ? params.node.name : 'Untitled folder',
      })
      if (params.node.name !== initialName) {
        enqueueSnackbar('Updated', { variant: 'success' })

        const logObj = {
          screen: AdminLogScreen.SimResources,
          target: {
            type: AdminLogTargetType.SimResources,   
            _type: 'folder',       
            _id: params.node._id || null,
            sid: props.selectedSimulationId,
            sname: props.selectedSimulation.name,
            origin: params.node.name,                
            message: 'folder updated',
            _key: 'folder_uptd'
          },
        }

        const adminLogManager = AdminLogManager.getInstance();
        adminLogManager?.createEditLog(logObj)         
      }       
    } else {
      await simDocStore.update(params.node._id, {
        title: params.node.title ? params.node.title : 'Untitled document',
      })
      if (params.node.title !== initialTitle) {
        enqueueSnackbar('Updated', { variant: 'success' })

        const logObj = {
          screen: AdminLogScreen.SimResources,
          target: {
            type: AdminLogTargetType.SimResources,   
            _type: 'doc',       
            _id: params.node._id || null,
            sid: props.selectedSimulationId,
            sname: props.selectedSimulation.name,
            origin: params.node.title,                
            message: 'doc updated',
            _key: 'doc_uptd',
            fname: params.parentNode?.name,
            fid: params.parentNode?._id,
          },
        }

        const adminLogManager = AdminLogManager.getInstance();
        adminLogManager?.createEditLog(logObj)          
      }       
    }
    setFocused(false)
    
    inputRef.current?.blur();   
  }

  const minimizeTitle = (title: string) => {
    const titleSize = getTextWidth(title, '14px')
    if (titleSize && titleSize > 180) {
      let firstChunk = ''
      let secondChunk = ''
      Array(title.length)
        .fill('')
        .forEach((_, index) => {
          const textWidth = getTextWidth(firstChunk, '14px')
          if (textWidth !== undefined && textWidth < 90) {
            firstChunk = firstChunk + title[index]
          }
        })
      Array(title.length)
        .fill('')
        .forEach((_, index) => {
          const textWidth = getTextWidth(secondChunk, '14px')
          if (textWidth !== undefined && textWidth < 90) {
            secondChunk = title[title.length - index - 1] + secondChunk
          }
        })
      return `${firstChunk} ... ${secondChunk}`
    }
    // if (title.length > 25) {
    //   return `${title.substring(0, 10)} ... ${title.substring(
    //     title.length - 10,
    //     title.length
    //   )}`
    // }
    return title
  }

  const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (context?.font) {
      context.font = font || getComputedStyle(document.body).font
    }

    return context?.measureText(text).width
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icon}
      {isFolder ? null : (
        <span
          style={{
            width: 48,
            height: 18,
            backgroundColor: '#eeeeee',
            marginLeft: 4,
            marginRight: 12,
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {params.node.visibleId}
        </span>
      )}
      {focused ? (
        <input
          ref={inputRef} 
          onChange={(e) => {
            if (isFolder) {
              params.node.name = e.target.value
            } else {
              params.node.title = e.target.value
            }
          }}
          onBlur={() => onBlur(params)}
          onFocus={() => isFolder ? setInitialName(params.node.name) : setInitialTitle(params.node.title)} // Set the initial label on focus
          onKeyPress={(e) => onKeyPressEnter(e, params)}
          style={{
            border: '0px',
            backgroundColor: 'transparent',
            width: isFolder ? 294 : 231,
            fontSize: '0.8em'
          }}
          autoFocus={focused}
          defaultValue={isFolder ? params.node.name : params.node.title}
        />        
      ) : (
        <Tooltip title={`${isFolder ? params.node.name : params.node.title}`}>
          <span
            style={{
              marginLeft: 1,
              fontSize: '0.8em',
              fontWeight: 400,
              backgroundColor: 'transparent',
              width: isFolder ? 293 : 230,
            }}
            tabIndex={0}
            onFocus={() => setFocused(true)}
          >
            {isFolder
              ? minimizeTitle(params.node.name)
              : minimizeTitle(params.node.title)}
          </span>
        </Tooltip>
      )}
    </div>
  )
}
