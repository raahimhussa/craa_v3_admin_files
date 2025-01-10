import useSWR, { SWRConfiguration } from 'swr'

import UIStore from 'src/stores/ui/uiStore'
import UiState from 'src/stores/ui'
import { WrappingFunction } from '@shopify/react-compose'
import { fetcher } from 'src/libs/swr/fetcher'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'
import { Box, Card, CircularProgress, Skeleton } from '@mui/material'

type WithRESTArguments = {
  defaultValue?: any
  endpoint?: string
  collectionName?: string | ((props: any) => string)
  path?: (props: any) => string
  propName?: string
  params?: (props: any) => any
  swrConfig?: SWRConfiguration
  version?: number | ((props: any) => number)
  uiStoreKey?: keyof UiState
}

const withREST =
  (args: WithRESTArguments): WrappingFunction =>
  (WrappedComponent) =>
    observer((props) => {
      const {
        defaultValue = undefined,
        endpoint = null,
        collectionName = '',
        propName = '',
        path = () => '',
        params = () => null,
        version = 1,
        swrConfig = props.params?.options?.lookupWhitelist
          ? { revalidateOnFocus: false }
          : {},
        uiStoreKey = null,
      } = args
      const store = useRootStore()
      const _collectionName =
        typeof collectionName === 'function'
          ? collectionName(props)
          : collectionName

      const _version = typeof version === 'function' ? version(props) : version
      const _endpoint = endpoint
        ? endpoint
        : `v${_version}/${_collectionName}/${path(props)}`

      const { data, error, mutate, isValidating } = useSWR(
        [_endpoint, params(props)],
        fetcher,
        swrConfig
      )

      useEffect(() => {
        if (data && uiStoreKey) {
          const uiStore = store['uiState'][uiStoreKey]
          if (uiStore instanceof UIStore) {
            uiStore.mutate = mutate
          }
        }
      }, [data])
      if (defaultValue === undefined && !data)
        return propName === 'userCardData' ? (
          <Card
            sx={{
              width: '100vw',
              height: 'calc(100vh - 44px)',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
            {/* <Skeleton
              variant="rectangular"
              width={'100%'}
              height={'100%'}
              // sx={{ bgcolor: '#f2f2f2' }}
            /> */}
          </Card>
        ) : (
          <CircularProgress
            sx={{ width: '20px !important', height: '20px !important' }}
          />
        )
      if (error) return <div>Error...</div>

      let _propName = _collectionName
      if (propName) {
        _propName = propName
      }

      const _props = {
        ...props,
        [_propName]: data ? data : defaultValue,
        [`${_propName}Mutate`]: mutate,
        isValidating,
      }
      return <WrappedComponent {..._props} />
    })

export default withREST
