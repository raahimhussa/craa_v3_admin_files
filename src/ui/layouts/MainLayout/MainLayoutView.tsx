import { Typography, Button, Box } from 'src/ui/core/components'
import AppBar from 'src/ui/core/components/surfaces/AppBar/AppBar';
import { observer } from 'mobx-react'
import uniqid from 'uniqid'
function MainLayoutView({ content = null, nav = null, children, menus, ...rest }: any) {
  const renderMenus = () =>
    menus?.map((menu: { onClick: any; label: any }) => {
      return (
        <Button onClick={menu.onClick} fullWidth={false} key={uniqid()} color="inherit">
          {menu.label}
        </Button>
      )
    })

  return (
    <>
      <AppBar />
      <Box>{renderMenus()}</Box>
      {children}
    </>
  )
}
export default observer(MainLayoutView)
