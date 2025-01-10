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
      uiState: { modal, users },
      userStore,
    } = useRootStore()
    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          userStore.resetForm()
          users.mutate = async () => {
            props.usersMutate && (await props.usersMutate())
            props.countMutate && (await props.countMutate())
          }
          modal.open('User', <User />)
        },
        color: 'secondary',
      },
      {
        title: 'Assign UserAC',
        onClick: () => {
          const selectedRowIds = toJS(props.state.selectedRowIds)

          if (selectedRowIds.length != 1) {
            return Swal.fire({
              title: 'Error',
              text: 'Please select one user.',
              heightAuto: false,
            })
          }
          modal.open('User', <AssignedUserAc userId={selectedRowIds[0]} />)
        },
        color: 'secondary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
