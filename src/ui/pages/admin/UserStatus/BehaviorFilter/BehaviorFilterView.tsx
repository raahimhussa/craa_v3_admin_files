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

function BehaviorFilterView({
  selectedOption,
  handleChangeSelectedOption,
}: Props) {
  return (
    <FormControl sx={{ width: 122, backgroundColor: 'white', ml: 1 }}>
      <InputLabel id="demo-simple-select-label">Behavior</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="user-status-management-select"
        value={selectedOption}
        label="Age"
        onChange={handleChangeSelectedOption}
        size="small"
      >
        <MenuItem value={0}>all</MenuItem>
        <MenuItem value={1}>unusual behavior</MenuItem>
      </Select>
    </FormControl>
  )
}
export default observer(BehaviorFilterView)
