import { observer } from 'mobx-react'
import { TextField, Typography, Uploader } from 'src/ui/core/components'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import FormField from 'src/ui/core/components/FormField/FormField'
import Files from 'src/ui/core/components/tables/Files/Files'
import { useEffect } from 'react'
function FolderView(props: any) {
  const { state, files } = props
  useEffect(() => {
    state.selectedDocs = files.filter((file: any) => state.selectedRowIds.includes(file._id))
    state.folder.files = [...state.selectedDocs]
  }, [JSON.stringify(state.selectedRowIds)])
  return (
    <></>
    // <DetailLayout isLabelVisible={false} collectionName="folders" document={{ ...state.folder }}>
    //   <FormField label="Name">
    //     <TextField state={state} path="folder.name" label="Name" />
    //   </FormField>
    //   <Uploader />
    //   <Typography></Typography>
    //   {state.folder.kind === 'FileFolder' && <Files buttons={false} files={files} state={state} />}
    // </DetailLayout>
  )
}
export default observer(FolderView)
