import { Agreements, Done, Registration } from 'src/ui/core/components/forms'
import { action } from 'mobx'
import { observer } from 'mobx-react'

const withMeta = (WrappedComponent: any) =>
  observer(({ state, onClickSignup, ...rest }: any) => {
    const steps = [
      {
        label: 'Privacy Policy',
        value: 0,
        render: () => <Agreements state={state} />,
        button: {
          label: 'NEXT',
          onClick: action(() => (state.step = 1)),
          disabled: !state.isChecked,
          loading: state.isLoading,
        },
      },
      {
        label: 'Registration',
        value: 1,
        render: () => <Registration state={state} />,
        button: {
          label: 'NEXT',
          onClick: onClickSignup,
          disabled: !(state.user.password && state.user.email),
          loading: state.isLoading,
        },
      },
      {
        label: 'Done',
        value: 2,
        render: () => <Done />,
        button: {
          label: 'HOME',
          onClick: async () => alert('설정요망'),
          disabled: false,
          loading: state.isLoading,
        },
      },
    ]
    return <WrappedComponent {...rest} state={state} steps={steps} />
  })

export default withMeta
