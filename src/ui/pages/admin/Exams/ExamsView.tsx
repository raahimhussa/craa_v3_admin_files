import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import Uploader from 'src/ui/core/components/Uploader/Uploader'
import { makeData } from '@utils'
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'
function ExamsView({ columns, state, leftButtons, rightButtons }: any) {
  const [data, setData] = useState(useMemo(() => makeData(200), []))

  return (
    <div>
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={data}
      />
    </div>
  )
}
export default observer(ExamsView)
