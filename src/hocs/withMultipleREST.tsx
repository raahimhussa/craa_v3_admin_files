import useSWR, { KeyedMutator, SWRConfiguration } from 'swr'

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
  mutables?: Array<string>
}

// In scenarios where multiple REST calls can be advantageous
const withMultipleREST = (
    endpoints: WithRESTArguments[]
  ): WrappingFunction =>
    (WrappedComponent) =>
      observer((props) => {
        const endpointData = endpoints.map((endpoint) => {
          const {
            defaultValue = undefined,
            endpoint: url = null,
            collectionName = '',
            propName = '',
            path = () => '',
            params = () => null,
            version = 1,
            swrConfig = props.params?.options?.lookupWhitelist
              ? { revalidateOnFocus: false }
              : {},
            uiStoreKey = null,
          } = endpoint;
  
          const store = useRootStore()

          const _collectionName =
            typeof collectionName === 'function'
              ? collectionName(props)
              : collectionName;
  
          const _version = typeof version === 'function' ? version(props) : version;
          const _endpoint = url
            ? url
            : `v${_version}/${_collectionName}/${path(props)}`;
  
          const { data, error, mutate, isValidating } = useSWR(
            [_endpoint, params(props)],
            fetcher,
            swrConfig
          );
  
          useEffect(() => {
            if (data && uiStoreKey) {
              const uiStore = store['uiState'][uiStoreKey];
              if (uiStore instanceof UIStore) {
                uiStore.mutate = mutate;
              }
            }
          }, [data]);
  
            if (defaultValue === undefined && !data) {
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
            }
            if (error) {return <div>Error...</div>}

            return {
                propName,
                data,
                mutate,
                isValidating,
                error,
            };
        });
          
        const _props = endpointData
        .filter((item): item is { propName: string; data: any; mutate: KeyedMutator<any>; isValidating: boolean; error: any; } => typeof item === 'object' && 'propName' in item)
        .reduce(
          (props, data) => ({
            ...props,
            [data.propName]: data.data,
            [`${data.propName}Mutate`]: data.mutate,
          }),
          props
        );   
  
        return <WrappedComponent {..._props} />;
      });
  

export default withMultipleREST
