import { action, flowResult } from 'mobx'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withHandler = (WrappedComponent: any) =>
  observer(({ state, ...rest }: any) => {
    const { authStore } = useRootStore()

    const onClickSignup = async () => {
      const signupUser = { ...state.user }

      await flowResult(await authStore.signup(signupUser))

      state.step = 2
    }

    const handlers = {
      onClickSignup: action(onClickSignup),
    }

    return <WrappedComponent {...rest} state={state} {...handlers} />
  })

export default withHandler
