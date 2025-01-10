import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  selectedOption: number
  handleChangeSelectedOption: (e: any) => void
}

function FiltersView({ selectedOption, handleChangeSelectedOption }: Props) {
  return (
    <FormControl sx={{ width: 213, backgroundColor: 'white', ml: 2 }}>
      <InputLabel id="demo-simple-select-label">Sort</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedOption}
        label="Age"
        onChange={handleChangeSelectedOption}
        size="small"
      >
        <MenuItem value={0}>None</MenuItem>
        <Divider />
        <MenuItem value={1}>
          <Box sx={{ display: 'flex' }}>
            Name <ArrowUpward fontSize="small" sx={{ ml: 1 }} />
          </Box>
        </MenuItem>
        <MenuItem value={2}>
          <Box sx={{ display: 'flex' }}>
            Name <ArrowDownward fontSize="small" sx={{ ml: 1 }} />
          </Box>
        </MenuItem>
        <MenuItem value={3}>
          <Box sx={{ display: 'flex' }}>
            Date Created <ArrowUpward fontSize="small" sx={{ ml: 1 }} />
          </Box>
        </MenuItem>
        <MenuItem value={4}>
          <Box sx={{ display: 'flex' }}>
            Date Created <ArrowDownward fontSize="small" sx={{ ml: 1 }} />
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}
export default observer(FiltersView)
