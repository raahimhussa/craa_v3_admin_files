import { observer } from 'mobx-react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Menu } from './withMeta'
import uniqid from 'uniqid'
import { MenuItems, Typography } from 'src/ui/core/components'
import { action, toJS } from 'mobx'
function MenusView({ state }: any) {
  return (
    <List sx={{ boxShadow: 2, height: '100%' }}>
      {state.menus.map((menu: Menu) => {
        if (!menu.isVisible) return null
        return (
          <div key={uniqid()}>
            <ListItem
              button
              onClick={action(() => {
                menu.isOpen = !menu.isOpen
                if (menu.onClick) {
                  menu.onClick()
                }
              })}
              key={uniqid()}
            >
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{
                    fontSize: 12,
                  }}
                  variant="button"
                >
                  {menu.text}
                </Typography>
              </ListItemText>
              {!!menu.items?.length && <ExpandLessOrMore isOpen={menu.isOpen} />}
            </ListItem>
            <MenuItems items={menu.items} isOpen={menu.isOpen} />
          </div>
        )
      })}
    </List >
  )
}
export default observer(MenusView)

const ExpandLessOrMore = observer(function ExpandLessOrMore({ isOpen }: any) {
  return <>{isOpen ? <ExpandLess /> : <ExpandMore />}</>
})
