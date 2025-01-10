import { Box } from '@mui/material'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function UsersView({
  users,
  columns,
  state,
  leftButtons,
  rightButtons,
  ...rest
}: any) {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 130px)',
        overflowY: 'auto',
      }}
    >
      <DataGrid
        {...rest}
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={users}
      />
    </Box>
  )
}
export default observer(UsersView)
