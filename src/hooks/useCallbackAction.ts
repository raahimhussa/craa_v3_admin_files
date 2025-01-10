import { action } from 'mobx'
import { useCallback } from 'react'

function useCallbackAction(fn: any, deps = []) {
  const handler = useCallback(action(fn), [deps])
  return handler
}
export default useCallbackAction
