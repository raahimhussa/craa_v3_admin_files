import { observer } from 'mobx-react'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import _ from 'lodash'
import { CategoryKind } from '../Category/Category'
import { Select, Stack, TextField, Typography } from 'src/ui/core/components'
import { FlatDataItem } from '@nosferatu500/react-sortable-tree'
import Files from 'src/ui/core/components/tables/Files/Files'
import Grid from '@mui/material/Grid'
import { Alert, AlertTitle, Card, CardContent, CardHeader } from '@mui/material'
import { reaction, toJS } from 'mobx'

type SimDoc = {
  name: string
  file: any
  domainCategory: {
    paths: string
    text: string
  }
}

type State = {
  simDoc: SimDoc
  selectedRowIds: Array<any>
}

type SimDocViewProps = {
  state: State
  path: string
  category: Categroy
  files: Array<any>
}

interface Categroy {
  _id: string
  isDeleted: boolean
  flattedItems: FlatDataItem[]
  items: Array<any>
  kind: CategoryKind
}
// @TODO MaxiumDepth 저장
function SimDocView({ state, category, files }: SimDocViewProps) {
  const categories = category.flattedItems.filter((item) => item.path.length === 2)
  const categoryItemOptions = categories.map((item) => {
    return {
      text: `${item.parentNode.title!} >> ${item.node.title}`,
      value: item.path.join('/'),
    }
  })

  reaction(
    () => state.selectedRowIds,
    () => {
      if (state.selectedRowIds.length === 0) return null
      state.simDoc.file = files.find((file: any) => file._id === state.selectedRowIds[0])
    }
  )

  reaction(
    () => state.simDoc.domainCategory.paths,
    () => {
      const item = categories.find(
        (item) => state.simDoc.domainCategory.paths === item.path.join('/')
      )
      if (item) {
        state.simDoc.domainCategory.text = `${item.parentNode.title!} >> ${item.node.title}`
      }
    }
  )

  return (
    <></>
    // <DetailLayout collectionName="simDocs" document={{ ...state.simDoc }}>
    //   <Grid container item spacing={2}>
    //     <Grid item xs={12}>
    //       <Card>
    //         <CardHeader title="Domain" />
    //         <CardContent>
    //           <Stack spacing={2}>
    //             <TextField state={state} path="simDoc.label" label="Label" />
    //             <Select
    //               state={state}
    //               options={categoryItemOptions}
    //               path="simDoc.domainCategory.paths"
    //             />
    //           </Stack>
    //         </CardContent>
    //       </Card>
    //     </Grid>
    //     <Grid item container xs={12} spacing={1}>
    //       <Grid item xs={6}>
    //         <Card>
    //           <CardHeader title="Uploaded" />
    //           <CardContent>
    //             <Files files={files} state={state} buttons={false} />
    //           </CardContent>
    //         </Card>
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Card>
    //           <CardHeader title="Selected File" />
    //           <CardContent>
    //             {!_.isEmpty(toJS(state.simDoc.file)) ? (
    //               <>
    //                 <Typography variant="body1">{`filename: ${state.simDoc.file?.name}`}</Typography>
    //                 <Typography variant="body1">{`mimetype: ${state.simDoc.file?.mimeType}`}</Typography>
    //                 <Typography variant="body1">{`size: ${state.simDoc.file?.size}KB`}</Typography>
    //                 <Typography variant="body1">{`createdAt: ${state.simDoc.file?.createdAt}`}</Typography>
    //               </>
    //             ) : (
    //               <Alert sx={{ height: '100%' }}>
    //                 <AlertTitle>Select File</AlertTitle>
    //               </Alert>
    //             )}
    //           </CardContent>
    //         </Card>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </DetailLayout>
  )
}
export default observer(SimDocView)
