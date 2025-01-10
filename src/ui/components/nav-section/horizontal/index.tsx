import { memo } from 'react'
// @mui
import { Stack } from '@mui/material'
//
import { NavSectionProps } from '../type'
import NavList from './NavList'

// ----------------------------------------------------------------------

const hideScrollbar = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const

function NavSectionHorizontal({ navConfig }: NavSectionProps) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{
        bgcolor: 'rgb(255,255,255,0.1)',
        borderRadius: 1,
        px: 0.5,
        height: '35px',
      }}
    >
      <Stack direction="row" sx={{ ...hideScrollbar, height: '35px' }}>
        {navConfig.map((group) => (
          <Stack key={group.subheader} direction="row" flexShrink={0}>
            {group.items.map((list) => (
              <NavList
                key={list.title + list.path}
                data={list}
                depth={1}
                hasChildren={!!list.children}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export default memo(NavSectionHorizontal)
