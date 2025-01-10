import { observer } from 'mobx-react'
const withRightButtons = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const rightButtons = [
      {
        title: 'RightButtons',
        onClick: () => {},
      },
    ]
    return <WrappedComponent {...rest} rightButtons={rightButtons} />
  })

export default withRightButtons
