import { Box, CircularProgress, Skeleton } from '@mui/material'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { fetcher } from 'src/libs/swr/fetcher'
import { useRootStore } from 'src/stores'
import UiState from 'src/stores/ui'
import UIStore from 'src/stores/ui/uiStore'
import ChartSkeleton from 'src/ui/pages/admin/Dashboard/Charts/ChartSkeleton'
import useSWR, { SWRConfiguration } from 'swr'

type WithFindArguments = {
  endpoint?: string
  collectionName?: string | ((props: any) => string)
  getFilter?: Function
  projection?: any
  getOptions?: Function
  propName?: string
  swrConfig?: SWRConfiguration
  version?: number
  uiStoreKey?: keyof UiState
}

const withFind =
  (args: WithFindArguments): WrappingFunction =>
  (WrappedComponent) =>
    observer((props) => {
      const {
        endpoint = null,
        collectionName = '',
        getFilter = () => null,
        projection = null,
        getOptions = () => null,
        propName = '',
        version = 1,
        swrConfig = {},
        uiStoreKey = null,
      } = args
      const store = useRootStore()
      const params = {
        filter: getFilter(props) || {},
        options: getOptions(props),
        projection,
      }
      let _collectionName = ''

      if (typeof collectionName === 'function') {
        _collectionName = collectionName(props)
      } else {
        _collectionName = collectionName
      }

      if (getOptions(props)) {
        params.options.multi = true
      } else {
        params.options = {
          multi: true,
        }
      }

      const _endpoint = endpoint ? endpoint : `v${version}/${_collectionName}`

      const { data, error, mutate } = useSWR(
        [_endpoint, params],
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

      if (!data)
        return _collectionName === 'dashboard' ? (
          <ChartSkeleton />
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
        [_propName]: data,
        [`${_propName}Mutate`]: mutate,
      }
      return <WrappedComponent {..._props} />
    })

export default withFind
