import { SWRConfiguration, useSWRConfig } from 'swr'
import { FullConfiguration } from 'swr/dist/types'
export default function useMatchMutate(config?: SWRConfiguration) {
  const { cache, mutate }: FullConfiguration = useSWRConfig()
  return (matchText: string, ...args: any) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance')
    }

    const keys = []
    // @ts-ignore
    for (const key of cache.keys()) {
      if (new RegExp(matchText).test(key)) {
        keys.push(key)
      }
    }

    const mutations = keys.map((key) => mutate(key, config, ...args))
    return Promise.all(mutations)
  }
}
