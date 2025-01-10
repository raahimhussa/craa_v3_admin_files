import { PATH_ADMIN } from 'src/routes/paths'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      uiState: { modal },
    } = useRootStore()
    const navigate = useNavigate()
    const leftButtons: any = []

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
