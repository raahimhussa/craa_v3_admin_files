import React, {useState, useRef } from 'react'

import FolderStore from 'src/stores/folderStore'
import { GenerateNodePropsParams } from '@components/SortableTree/types'
import { Tooltip } from '@mui/material'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

type Props = {
  icon: JSX.Element | null
  params: GenerateNodePropsParams
  isFolder: boolean
  recentlyAddedNodeId: string
}

export const LabelInput = (props: Props) => {
  const { icon, params, isFolder } = props
  const { folderStore, simDocStore } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const [labelFocused, setLabelFocused] = useState<boolean>(false)

  const [initialLabel, setInitialLabel] = useState<string>(''); // State to keep track of the initial label
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input    

  const onKeyPressEnter = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    params: GenerateNodePropsParams
  ) => {
    if (e.key === 'Enter') {        
      if (params.node.store instanceof FolderStore) {
        await folderStore.update(params.node._id, {
          label: params.node.label ? params.node.label : 'unlabeled',
        })
      } else {
        await simDocStore.update(params.node._id, {
          label: params.node.label ? params.node.label : 'unlabelled',
        })
      }

      inputRef.current?.blur();

      if (params.node.label !== initialLabel) {
        enqueueSnackbar('Updated', { variant: 'success' })
      }
        
    }
  }

  const onBlur = async (params: GenerateNodePropsParams) => {
    if (params.node.store instanceof FolderStore) {
      await folderStore.update(params.node._id, {
        label: params.node.label ? params.node.label : 'unlabelled',
      })
    } else {
      await simDocStore.update(params.node._id, {
        label: params.node.label ? params.node.label : 'unlabelled',
      })
    }
    setLabelFocused(false)

    if(params.node.label !== initialLabel) {
        enqueueSnackbar('Updated', { variant: 'success' })
    }
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
        alignItems: 'center',
      }}
    >
      {icon}       
      {labelFocused ? (
        <input
            ref={inputRef} 
          onChange={(e) => {
            if (isFolder) {                
              params.node.label = e.target.value
            } else {
              params.node.label = e.target.value
            }
          }}
          onBlur={() => onBlur(params)}
          onFocus={() => setInitialLabel(params.node.label)} // Set the initial label on focus
          onKeyPress={(e) => onKeyPressEnter(e, params)}
          style={{
            border: '0px',
            backgroundColor: 'transparent',
            width: 294,
            fontSize: '0.8em'
          }}
          autoFocus={labelFocused}
          defaultValue={params.node.label}
        />        
      ) : (
        <Tooltip title={`${isFolder ? params.node.label : params.node.label}`}>
          <span
            style={{
              marginLeft: 1,
              fontSize: '0.8em',
              fontWeight: 400,
              backgroundColor: 'transparent',
              width: isFolder ? 293 : 230,
            }}
            tabIndex={1}
            onFocus={() => setLabelFocused(true)}
          >
            {isFolder
              ? minimizeTitle(params.node.label)
              : minimizeTitle(params.node.label)}
          </span>
        </Tooltip>
      )}
    </div>
  )
}
