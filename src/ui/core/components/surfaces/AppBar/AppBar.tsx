import { observer } from 'mobx-react'
import { Box, Typography } from 'src/ui/core/components'
import { IconButton, Toolbar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useRootStore } from 'src/stores'
import ProfileCard from 'src/ui/core/components/ProfileCard/ProfileCard'

function AppBarView() {
  const {
    uiState: { adminLayout },
  } = useRootStore()

  return (
    <Box
      sx={{
        boxShadow: 2,
        // backgroundImage: (theme) => theme.craa?.palette.mainGradiant,
        display: 'flex',
        flex: 1,
        height: 54,
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={() => adminLayout.toggleDrawer()}
          aria-label="open drawer"
          edge="start"
          sx={{
            color: 'white',
            mr: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" color={'white'}>
          CRA Assessments
        </Typography>
      </Box>
      <Box>
        <ProfileCard />
      </Box>
    </Box>
  )
}
export default observer(AppBarView)
