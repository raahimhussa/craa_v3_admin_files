import { Autocomplete, Box, TextField } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'

import { MobxUtil } from '@utils'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

function FindingAutocompleteCompareView(props: any) {
  const {
    state = {},
    path = '',
    options = [],
    multiple = true,
    onChange: _onChange,
    label = '',
    limitTags = 1,
    max = -1,
    maxErrorMessage = '',
  } = props

  const { enqueueSnackbar } = useSnackbar()
  const { findingStore } = useRootStore()

  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || [],
  }))

  const value = options.filter((option: any) =>
    localState.value.includes(option.value)
  )

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  const getOptionLabel = (option: any) => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 36,
        }}
      >
        <Box>{option?.text || ''}</Box>
      </Box>
    )
  }
  const onChange = (event: any, selectedOptions: any) => {
    if (max > 0 && selectedOptions.length > max)
      return enqueueSnackbar(maxErrorMessage || 'too many tags', {
        variant: 'error',
      })
    const selectedValues = selectedOptions.map((option: any) => option.value)
    localState.value.replace(selectedValues)
    if (_onChange) {
      _onChange(event, selectedOptions)
    }
  }

  return (
    <Autocomplete
      // className="buAutocomplete"
      {...props}
      limitTags={limitTags}
      ChipProps={{
        sx: {
          backgroundColor: 'white',
          border: '1px solid grey',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderRadius: 0,
        },
      }}
      multiple={multiple}
      onChange={onChange}
      options={options}
      getOptionLabel={getOptionLabel}
      // defaultValue={defaultValue}
      value={value}
      renderOption={(
        renderOptionProps: any,
        {
          text,
        }: {
          text: string
        }
      ) => {
        return (
          <Box {...renderOptionProps} sx={{ height: 36 }}>
            <Box>{text}</Box>
          </Box>
        )
      }}
      filterOptions={(options, state) => {
        const { inputValue } = state
        return options.filter((_option) =>
          (_option as any).text.toLowerCase().includes(inputValue.toLowerCase())
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          // variant={'outlined'}
          label={label}
          // sx={{ height: '72px !important' }}
          InputProps={{
            ...params.InputProps,
            sx: {
              '&.MuiInputBase-root': {
                minHeight: 37.13,
                height: '100%',
              },
            },
          }}
        />
      )}
    />
  )
}
export default observer(FindingAutocompleteCompareView)
