import { Container } from 'src/ui/core/components'
import { Signin } from 'src/ui/core/components/forms'
import { observer } from 'mobx-react'
function LoginView({ ...rest }: any) {
  return (
    <Container style={{ width: 400 }}>
      <div
        style={{
          border: '1px dashed black',
          height: 300,
          width: '100%',
          marginTop: 100,
          marginBottom: 50,
        }}
      >
        LOGO AREA
      </div>
      <Signin />
    </Container>
  )
}
export default observer(LoginView)
