import { observer } from 'mobx-react'
import { Stack } from '@mui/material'
import Editor from 'src/ui/core/components/Editor/Editor'
import { useRootStore } from 'src/stores'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { TextField } from 'src/ui/core/components'
export enum TemplateKind {
  PrivacyPolicy = 'privacyPolicy',
  TermsOfService = 'termsOfService',
}
function TemplateView(props: any) {
  const { state } = props
  const { templateStore, uiState: { templates } } = useRootStore()
  return (
    <DetailLayout
      store={templateStore}
      mutate={templates.mutate}
    >
      <Stack spacing={2} sx={{ p: 2, bgcolor: 'white' }}>
        <TextField state={templateStore} path="form.title" label="title" />
        <TextField state={templateStore} path="form.key" label="Key" />
        <Editor state={templateStore} path="form.htmlContent" />
      </Stack>
    </DetailLayout>
  )
}
export default observer(TemplateView)
