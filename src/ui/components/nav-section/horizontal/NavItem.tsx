import { forwardRef } from 'react'
// @mui
import {
  Box,
  Tooltip,
  ListItemButtonProps,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
// hooks
// guards
// config
//
import { NavItemProps } from '../type'
import Iconify from '../../Iconify'
import { ListItemStyle } from './style'
import useLocales from 'src/hooks/useLocales'
import { ICON } from 'src/config'

// ----------------------------------------------------------------------

type Props = NavItemProps & ListItemButtonProps

const NavItem = forwardRef<HTMLDivElement & HTMLAnchorElement, Props>(
  ({ item, depth, active, open, ...other }, ref) => {
    const { translate } = useLocales()

    const { title, icon, info, children, disabled, caption, roles } = item

    const renderContent = (
      <ListItemStyle
        ref={ref}
        open={open}
        depth={depth}
        active={active}
        disabled={disabled}
        {...other}
      >
        {icon && (
          <ListItemIcon
            sx={{
              mr: 1,
              flexShrink: 0,
              width: ICON.NAVBAR_ITEM_HORIZONTAL,
              height: ICON.NAVBAR_ITEM_HORIZONTAL,
              color: active ? '#264c56' : 'white',
            }}
          >
            {icon}
          </ListItemIcon>
        )}

        <ListItemText
          primary={translate(title)}
          primaryTypographyProps={{
            noWrap: true,
            variant: active ? 'subtitle2' : 'subtitle2',
          }}
          sx={{
            color: active ? '#264c56' : 'white',
          }}
        />

        {caption && (
          <Tooltip title={translate(caption)} arrow>
            <Box component="span" sx={{ ml: 0.5, lineHeight: 0 }}>
              <Iconify
                icon="eva:info-outline"
                sx={{
                  width: ICON.NAVBAR_ITEM_HORIZONTAL / -4,
                  height: ICON.NAVBAR_ITEM_HORIZONTAL / -4,
                }}
              />
            </Box>
          </Tooltip>
        )}

        {info && (
          <Box component="span" sx={{ ml: 1, lineHeight: 0 }}>
            {info}
          </Box>
        )}

        {!!children && (
          <Iconify
            icon={
              depth > 1 ? 'eva:chevron-right-fill' : 'eva:chevron-down-fill'
            }
            sx={{
              ml: 0.5,
              flexShrink: 0,
              width: ICON.NAVBAR_ITEM_HORIZONTAL,
              height: ICON.NAVBAR_ITEM_HORIZONTAL,
              color: active ? '#264c56' : 'white',
            }}
          />
        )}
      </ListItemStyle>
    )

    // return <RoleBasedGuard roles={roles}>{renderContent}</RoleBasedGuard>;
    return <Box>{renderContent}</Box>
  }
)

export default NavItem
