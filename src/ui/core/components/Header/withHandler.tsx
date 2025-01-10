import { observer } from 'mobx-react'

const withHandler = (WrappedComponent: any) =>
  observer(({ state, ...rest }: any) => {
    const onClickSignin = () => {
    }
    const onClickSignup = () => {
    }

    const headerHandler = {
      onClickSignin,
      onClickSignup,
    }

    return <WrappedComponent {...rest} headerHandler={headerHandler} state={state} />
  })

export default withHandler
