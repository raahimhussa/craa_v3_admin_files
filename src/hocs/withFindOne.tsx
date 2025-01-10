import _ from 'lodash'
import { observer } from 'mobx-react'
import { fetcher } from 'src/libs/swr/fetcher'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

import pluralize from 'pluralize'
import { useEffect } from 'react'
import { WrappingFunction } from '@shopify/react-compose'
import { useRootStore } from 'src/stores'
import UiState from 'src/stores/ui'
import UIStore from 'src/stores/ui/uiStore'
import axios from 'axios'
import { Box, CircularProgress, Skeleton } from '@mui/material'

type WithFindOneArguments = {
  collectionName: string
  getFilter?: Function
  projection?: any
  getOptions?: Function
  propName?: string
  version?: number
  isDocNeeded?: boolean
  uiStoreKey?: keyof UiState
}

const withFindOne =
  (args: WithFindOneArguments): WrappingFunction =>
  (WrappedComponent) =>
    observer((props) => {
      const {
        collectionName = '',
        getFilter = () => null,
        projection = null,
        getOptions = () => null,
        propName = '',
        version = 1,
        isDocNeeded = true,
        uiStoreKey = null,
      } = args
      const store = useRootStore()

      const params = {
        filter: getFilter(props) || {},
        options: getOptions(props),
        projection,
      }

      if (getOptions(props)) {
        params.options.multi = false
      } else {
        params.options = {
          multi: false,
        }
      }

      const endpoint =
        version === 1
          ? `v${version}/${collectionName}`
          : `v${version}/${collectionName}/custom`

      const { data, error, mutate } = useSWR([endpoint, params], fetcher)

      useEffect(() => {
        if (data && uiStoreKey) {
          const uiStore = store['uiState'][uiStoreKey]
          if (uiStore instanceof UIStore) {
            uiStore.mutate = mutate
          }
        }
      }, [data])

      axios.isAxiosError(error) && console.error(error)

      if (isDocNeeded) {
        if (!data)
          return (
            <CircularProgress
              sx={{ width: '20px !important', height: '20px !important' }}
            />
          )
        if (error) return <div>Error...</div>
      }

      let _propName = pluralize.singular(collectionName)

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

export default withFindOne
