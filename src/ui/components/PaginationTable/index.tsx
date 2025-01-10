import { useEffect, useState } from 'react'

import PaginationTable from './PaginationTable'
import { useRootStore } from 'src/stores'

type Props = {
  collectionName: string
  params?: {
    filter: any
    options?: any
  }
  Table: React.ComponentType
  version?: number
  state?: any
  buttons?: boolean
} & any

// function useForceUpdate() {
//   const [value, setValue] = useState(0) // integer state
//   return () => setValue((value: any) => value + 1) // update state to force render
//   // A function that increment 👆🏻 the previous state like here
//   // is better than directly setting `setValue(value + 1)`
// }

export default ({
  collectionName,
  Table,
  version,
  params,
  state,
  buttons,
  ...rest
}: Props) => {
  return (
    <PaginationTable
      collectionName={collectionName}
      Table={Table}
      version={version}
      params={params}
      state={state}
      buttons={buttons}
      {...rest}
    />
  )
}

//NOTE - PaginationTable을 이용하기 위해선 해당 테이블의 "{url}/count"를 만들어줘야함 (service-api: findings 참조)
