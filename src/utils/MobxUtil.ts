class MobxUtil {
  static _get = (state: any, path: any) => {
    if (!state || !path) {
      return null
    }
    let value: any = ''
    eval(`value = state.${path}`)
    return value
  }

  static _set = (state: any, path: any, value: any) => {
    if (!state || !path) {
      return null
    }

    return eval(`state.${path} = value`)
  }
}
export default MobxUtil
