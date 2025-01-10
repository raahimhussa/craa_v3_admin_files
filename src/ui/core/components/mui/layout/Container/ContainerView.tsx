import { Container } from '@mui/material'
import { observer } from 'mobx-react'
function ContainerView({ mui = false, width = 300, ...rest }) {
  return <Container {...rest} />
}
export default observer(ContainerView)
