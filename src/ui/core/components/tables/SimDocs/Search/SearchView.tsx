import { TextField } from '@mui/material'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  searchString: string
  handleChangeSearchString: (e: any) => void
}

function SearchView({ searchString, handleChangeSearchString }: Props) {
  return (
    <TextField
      size="small"
      sx={{ width: 212, backgroundColor: 'white' }}
      placeholder="Search"
      value={searchString}
      onChange={handleChangeSearchString}
    />
  )
}
export default observer(SearchView)
