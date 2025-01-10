import DialogMount from './ui/navigation/DialogMount/DialogMount'
import ModalMount from './ui/navigation/ModalMount/ModalMount'
import MotionLazyContainer from './ui/components/animate/MotionLazyContainer'
import Router from './routes'
import RouterStore from './stores/routerStore'
import { SnackbarProvider } from 'notistack'
import ThemeProvider from './theme'
import ThemeSettings from './ui/components/settings'
import UploadingPopup from './ui/pages/admin/Files/UploadingPopup/UploadingPopup'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from './stores'
function App() {
  const navigate = useNavigate()
  const root = useRootStore()
  useEffect(() => {
    root.routerStore = new RouterStore(root, navigate)
  }, [])

  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Router />
            <ModalMount />
            <DialogMount />
          </SnackbarProvider>
          <UploadingPopup />
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  )
}

export default observer(App)
