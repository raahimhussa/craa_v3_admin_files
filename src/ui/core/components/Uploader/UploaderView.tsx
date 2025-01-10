import { FileItem, LocalState, UploaderProps } from './types'
import { MobxUtil, Utils } from '@utils'
import { action, flowResult, reaction } from 'mobx'
import { getSingleUploadFile, postFile, updateFile, upload } from './utils'
import { observer, useLocalObservable } from 'mobx-react'

import Box from '@mui/material/Box'
import FileUpload from 'react-material-file-upload'
import axios from 'axios'
import { useRootStore } from 'src/stores'
import { useSWRConfig } from 'swr'

function UploaderView(props: UploaderProps) {
  const { state, path, fileId } = props
  const { cache, mutate } = useSWRConfig()

  const localState: LocalState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || null,
    files: [],
    isLoading: false,
  }))

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  const onChange = action(async (files: File[]) => {
    try {
      localState.isLoading = true

      const fileItems = await Promise.all(files.map(getSingleUploadFile))
      await upload(fileItems, fileId)
      Utils.matchMutate(cache, mutate, 'v3/pdfFileManagement')

      localState.files = files
    } catch (error: unknown) {
      console.error(error)
    } finally {
      localState.isLoading = false
    }
  })

  const button = {
    title: 'Upload your files',
    text: 'Upload',
    disabled: false,
  }

  if (localState.isLoading) {
    button.title = 'It takes a few seconds. please do not leave this page.'
    button.text = 'Uploading...'
    button.disabled = true
  }

  return (
    <Box sx={{ bgcolor: 'white' }}>
      <FileUpload
        multiple
        accept="application/pdf"
        buttonText={button.text}
        title={button.title}
        disabled={button.disabled}
        onChange={onChange}
        value={[]}
      />
    </Box>
  )
}
export default observer(UploaderView)
