import { Box, Button, FormControlLabel, FormGroup, Switch } from '@mui/material'
import { OnSubmissionVariableKey, TemplateStatus } from 'src/utils/status'

import Editor from '@components/Editor/Editor'
import React from 'react'
import { TextField } from '@components'
import axios from 'axios'
import { toJS } from 'mobx'
import { useSnackbar } from 'notistack'

type Props = {
  state?: any
  path?: string
  mutate?: any
}

export const SubmissionEditor = (props: Props) => {
  const { state, path, mutate } = props
  const { enqueueSnackbar } = useSnackbar()

  const onClickSave = async () => {
    try {
      await axios.patch('v1/simulations', {
        filter: {
          _id: toJS(state.form._id),
        },
        update: {
          $set: {
            onSubmission: toJS(state.form.agreement),
          },
        },
      })
      mutate && (await mutate())
      enqueueSnackbar('onSubmission saved successfully', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('onSubmission saved failed', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            state={state}
            path={`${path}.title`}
            placeholder={'Title'}
            variant="filled"
            sx={{ mt: 1, mb: 1 }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 360,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ml: 4,
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    sx={{
                      '.MuiSwitch-thumb': {
                        backgroundColor: toJS(state.form.onSubmission.published)
                          ? 'rgb(72,72,72)'
                          : 'salmon',
                      },
                    }}
                  />
                }
                label="Publish"
              />
            </FormGroup>
          </Box>
          <Button variant="contained" sx={{ ml: 16 }} onClick={onClickSave}>
            Save
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ flex: 1 }}>
          <Editor {...props} path={`${path}.htmlContent`} />
        </Box>
        <Box sx={{ width: 360 }}>
          <table>
            <tr>
              <th style={{ width: 160 }}>key</th>
              <th style={{ width: 200 }}>usage</th>
            </tr>
            {Object.values(OnSubmissionVariableKey).map(
              (_value: OnSubmissionVariableKey, index: number) => {
                return (
                  <tr key={index}>
                    <td
                      style={{
                        paddingLeft: 24,
                        paddingTop: 4,
                        paddingBottom: 4,
                      }}
                    >
                      {_value}
                    </td>
                    <td
                      style={{
                        paddingLeft: 24,
                        paddingTop: 4,
                        paddingBottom: 4,
                      }}
                    >{`{${_value}}`}</td>
                  </tr>
                )
              }
            )}
          </table>
        </Box>
      </Box>
    </Box>
  )
}
