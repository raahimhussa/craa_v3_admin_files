import { TextField } from 'src/ui/core/components'
import Stack from '@mui/material/Stack'
import { observer } from 'mobx-react'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
function RoleView({ state }: any) {
  return (
    <></>
    // <DetailLayout collectionName="roles" document={{ ...state.role }}>
    //   <Stack spacing={2} sx={{ p: 2 }}>
    //     <TextField variant="outlined" state={state} path="role.title" label="Name" size="small" />
    //     <TextField
    //       number
    //       type={'number'}
    //       size="small"
    //       variant="outlined"
    //       state={state}
    //       path="role.priority"
    //       label="PriorityNo"
    //     />
    //   </Stack>
    // </DetailLayout>
  )
}
export default observer(RoleView)
