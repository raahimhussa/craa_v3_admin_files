import { TextField, Typography } from 'src/ui/core/components'
import { ButtonGroup, Paper, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
function CategoryItemView(props: any) {
  const { state } = props
  const { modalStore } = useRootStore()
  const onClickSave = () => {
    modalStore.categoryItem.payload.callback(state.categoryItem)
    modalStore.categoryItem.isVisible = false
  }

  const onClickCancel = () => {
    modalStore.categoryItem.isVisible = false
  }

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Stack spacing={4}>
        <Typography>EDIT</Typography>
        <TextField label="TITLE" state={state} path="categoryItem.title" />
        <ButtonGroup>
          <Button onClick={onClickSave} variant="contained">
            Save
          </Button>
          <Button onClick={onClickCancel} variant="outlined">
            Cancel
          </Button>
        </ButtonGroup>
      </Stack>
    </Paper>
  )
}
export default observer(CategoryItemView)
