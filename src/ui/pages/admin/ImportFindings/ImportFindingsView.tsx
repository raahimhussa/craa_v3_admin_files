import {
  Alert,
  AlertTitle,
  Box,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material'
import { MobxUtil, Utils } from '@utils'
import { action, flowResult, reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'

import FileUpload from 'react-material-file-upload'
import FindingsXlsx from './FindingsXlsx/FindingsXlsx'
import { LocalState } from '@components/Uploader/types'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { useRootStore } from 'src/stores'
import { useSWRConfig } from 'swr'
import { useSnackbar } from 'notistack'

const ImportFindingView = observer((props: any) => {
  const { state, path } = props
  const { fileStore } = useRootStore()

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
    if (files.length > 0) {
      console.log(files[0].type, files[0])
    }
    try {
      localState.isLoading = true

      localState.files = files
    } catch (error: unknown) {
      console.error(error)
    } finally {
      localState.isLoading = false
    }
  })

  const button = {
    text: 'Upload',
    disabled: false,
  }

  if (localState.isLoading) {
    button.text = 'Uploading...'
    button.disabled = true
  }

  return (
    <Box sx={{ bgcolor: 'white' }}>
      {localState.files.length > 0 ? (
        <FindingsXlsx file={localState.files[0]} />
      ) : (
        <FileUpload
          accept={accept}
          buttonText={button.text}
          disabled={button.disabled}
          onChange={onChange}
          value={[]}
        />
      )}
    </Box>
  )
})

export default compose<any>()(ImportFindingView)

const accept = ['.csv', '.xlsx', '.xls']
