import { observer } from 'mobx-react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import { Menu } from 'src/ui/core/components/Menus/withMeta'
import uniqid from 'uniqid'
import { Typography } from 'src/ui/core/components'

function MenuItemsView({ items, isOpen }: any) {
  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {items.map((item: Menu) => (
          <ListItem
            sx={{ pl: 4, height: 40 }}
            onClick={() => {
              items.forEach((_item: any) => {
                if (_item.text == item.text) {
                  _item.isOpen = true
                } else {
                  _item.isOpen = false
                }
              })

              if (item.onClick) {
                item.onClick()
              }
            }}
            key={uniqid()}
            button
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  textTransform: 'none',
                }}
                variant="caption"
              >
                {item.text}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Collapse>
  )
}
export default observer(MenuItemsView)
