import * as React from 'react'

import { Box, Paper } from '@mui/material'

import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import { Search } from '@mui/icons-material'
import { observer } from 'mobx-react'

function SearchInputView({
  preGlobalFilteredRows,
  setGlobalFilter,
  globalFilter,
}: any) {
  const count = preGlobalFilteredRows?.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = (value: any) => {
    setGlobalFilter(value || undefined)
  }

  return (
    <Paper
      component="span"
      sx={{
        p: '0px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flex: 1,
        border: '1px solid rgb(170, 183, 184)',
        borderRadius: '2px',
        // height: '30px',
      }}
    >
      <IconButton sx={{ p: 0, pl: 0.5 }}>
        <Search sx={{ fontSize: '22px' }} />
      </IconButton>
      <InputBase
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        sx={{
          ml: 1,
          flex: 1,
          fontSize: '14px',
          height: '30px',
        }}
        placeholder={`${count} Rows`}
        inputProps={{ 'aria-label': 'search google maps' }}
      />
    </Paper>
  )
}

export default observer(SearchInputView)
