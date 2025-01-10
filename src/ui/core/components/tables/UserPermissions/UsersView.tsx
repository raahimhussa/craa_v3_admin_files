import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { Box } from '@mui/material'
function UsersView({
  users,
  columns,
  state,
  // leftButtons,
  // rightButtons,
  ...rest
}: any) {
  console.log(columns)
  return (
    <Box
      sx={{
        height: 'calc(100vh - 140px)',
        overflowY: 'auto',
        // mt: -6,
      }}
    >
      <DataGrid
        {...rest}
        state={state}
        columns={columns}
        // leftButtons={leftButtons}
        // rightButtons={rightButtons}
        data={users}
      />
    </Box>
  )
}
export default observer(UsersView)
