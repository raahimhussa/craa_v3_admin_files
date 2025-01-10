import { TableCell, TableRow } from '@mui/material'
import { grey } from '@mui/material/colors'
import { observer } from 'mobx-react'
function CategoryView(props: {}) {
  return (
    <TableRow>
      <TableCell
        sx={{ bgcolor: grey[400], color: 'white', fontSize: 16, fontWeight: 600, textAlign: 'center' }}
        colSpan={3}>
        FolderName
      </TableCell>
    </TableRow>
  )
}

export default observer(CategoryView)