import { AgreementVariableKey, TemplateStatus } from 'src/utils/status'
import { Box, Button, FormControlLabel, FormGroup } from '@mui/material'
import { Switch, TextField } from '@components'

import Editor from '@components/Editor/Editor'
import { EditorProps } from '@toast-ui/react-editor'
import { MobxUtil } from '@utils'
import React from 'react'
import axios from 'axios'
import { toJS } from 'mobx'
import { useSnackbar } from 'notistack'

type Props = {
  state?: any
  path?: string
  mutate?: any
}

export const AgreementEditor = (props: Props) => {
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
            agreement: toJS(state.form.agreement),
          },
        },
      })
      mutate && (await mutate())
      enqueueSnackbar('agreement saved successfully', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('agreement saved failed', { variant: 'error' })
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
                    state={state}
                    path={`${path}.status`}
                    sx={{
                      '.MuiSwitch-thumb': {
                        backgroundColor: toJS(state.form.agreement.published)
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
            {Object.values(AgreementVariableKey).map(
              (_value: AgreementVariableKey, index: number) => {
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
