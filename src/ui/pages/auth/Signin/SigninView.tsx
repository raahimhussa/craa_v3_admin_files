import { observer } from 'mobx-react'
import { Copyright, Typography } from 'src/ui/core/components'
import { Signin } from 'src/ui/core/components/forms'
import AppBar from '@mui/material/AppBar'
import {
  Box,
  Card,
  Stack,
  Link,
  Alert,
  Tooltip,
  Container,
  styled,
} from '@mui/material'

function SigninPageView() {
  const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  }))

  const HeaderStyle = styled('header')(({ theme }) => ({
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg,#53aca9,#377270 25%,#377270)',
    // backgroundColor : theme.palette.primary.main,
    [theme.breakpoints.up('md')]: {
      // alignItems: 'flex-start',
      padding: theme.spacing(2, 5, 2, 5),
    },
  }))

  const FooterStyle = styled('header')(({ theme }) => ({
    bottom: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: theme.spacing(3),
    justifyContent: 'center',
    // background : 'linear-gradient(135deg,#53aca9,#377270 25%,#377270)',
    // backgroundColor: 'white',
    [theme.breakpoints.up('md')]: {
      // alignItems: 'flex-start',
      padding: theme.spacing(2, 5, 2, 5),
    },
  }))

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    // minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0),
    marginTop: 200,
  }))
  return (
    <RootStyle>
      <HeaderStyle>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              ml: 1.5,
              color: 'white',
              fontWeight: 700,
              fontSize: '1.5rem',
            }}
          >
            CRA Assessments
          </Typography>
        </div>
      </HeaderStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 0 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                }}
              >
                Sign in
              </Typography>
            </Box>
          </Stack>

          <Signin />
        </ContentStyle>
      </Container>
      <FooterStyle>
        <Typography
          variant="body2"
          sx={{
            color: '#377270',
          }}
        >
          © Copyright 2022 CRA Assessments - All Rights Reserved
        </Typography>
      </FooterStyle>
    </RootStyle>
    // <>
    //   <AppBar
    //     sx={{
    //       // backgroundImage: (theme) => theme.craa?.palette.mainGradiant,
    //       height: '58px',
    //       justifyContent: 'center',
    //       px: 2
    //     }}>
    //     <Typography variant="h6">
    //       CRA Assessments
    //     </Typography>
    //   </AppBar>
    //   <Container maxWidth='xs' sx={{ mt: 24 }} >
    //     <Signin />
    //   </Container>
    //   <Copyright />
    // </>
  )
}
export default observer(SigninPageView)
