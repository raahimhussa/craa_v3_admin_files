import Agreement from 'src/ui/pages/admin/modals/Agreement/Agreement'
import AssignedUserAc from 'src/ui/pages/admin/modals/AssignedUserAc/AssignedUserAc'
import Swal from 'sweetalert2'
import User from 'src/ui/pages/admin/User/User'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const {
      uiState: { modal },
      userStore,
    } = useRootStore()
    const leftButtons = [{}]

    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
