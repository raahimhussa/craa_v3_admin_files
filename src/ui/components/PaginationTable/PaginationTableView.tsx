import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'

import ReactPaginate from 'react-paginate'
import TableContainer from './TableContainer/TableContainer'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useState } from 'react'

// @ts-ignore
function PaginationTableView(props) {
  const [offset, setOffset] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    props.params?.options?.limit || 20
  )
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const itemsCount = props.count

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * itemsPerPage) % itemsCount
    setOffset(newOffset)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setItemsPerPage(event.target.value as unknown as number)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <TableContainer {...props} offset={offset} limit={itemsPerPage} />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          height: '72px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography>show</Typography>
          <Select
            value={itemsPerPage.toString()}
            onChange={handleChange}
            sx={{ ml: 1, mr: 1 }}
            className="pageSelect"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
          <Typography>items per page</Typography>
        </Box>
        <ReactPaginate
          pageCount={Math.ceil(props.count / itemsPerPage)}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          previousLinkClassName={'pagination__link'}
          nextLinkClassName={'pagination__link'}
          disabledClassName={'pagination__link--disabled'}
          activeClassName={'pagination__link--active'}
        />
      </Box>
    </>
  )
}
export default observer(PaginationTableView)
