import { Box, TableCell } from '@mui/material'

export const TableCellHeadStart = ({
  children,
  width,
}: {
  children: any
  width?: number
}) => {
  return (
    <TableCell sx={{ width }}>
      <Box
        sx={{
          display: 'flex',
          height: 24,
        }}
      >
        <Box sx={{ width: 16 }} />
        {children}
      </Box>
    </TableCell>
  )
}

export const TableCellHead = ({
  children,
  width,
  justifyContent = 'center',
  last = false,
}: {
  children: any
  width?: number
  justifyContent?: string
  last?: boolean
}) => {
  return (
    <TableCell sx={{ width }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent,
          alignItems: 'center',
          height: 24,
          borderRight: last ? undefined : '1px solid grey',
        }}
      >
        {children}
      </Box>
    </TableCell>
  )
}
