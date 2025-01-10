import { Autocomplete, Box, TextField } from '@mui/material'

import FindingsTable from 'src/ui/core/components/tables/Findings/Findings'
import Loading from '@components/Loading/Loading'
import { ReactNode } from 'react'
import Simulation from 'src/models/simulation'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  searchString: string
  onChange: (e: any) => void
}

function SearchBarView({ searchString, onChange }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
      <TextField
        size="small"
        sx={{ width: 350, ml: 4 }}
        value={searchString}
        onChange={onChange}
        placeholder={'search'}
      />
    </Box>
  )
}
export default observer(SearchBarView)
