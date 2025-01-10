import { AdminLogManager } from 'src/classes/adminLogManager'
import { fetcherWithToken } from 'src/libs/swr/fetcher'
import { getCookie } from 'cookies-next'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'
import useSWRImmutable from 'swr/immutable'

function useUser() {
  const { authStore } = useRootStore()
  const token = getCookie('accessToken')

  const { data: user, isValidating } = useSWRImmutable(
    token ? ['v1/auth/token', token] : null,
    fetcherWithToken
  )

  useEffect(() => {
    if (user) {
      authStore.user = user
      AdminLogManager.createInstance(
        user._id,
        user?.role?.title || '',
        `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`
      )
    }
  }, [user])
  return {
    data: user,
    isLoading: !user,
    isValidating: isValidating,
  }
}
export default useUser
