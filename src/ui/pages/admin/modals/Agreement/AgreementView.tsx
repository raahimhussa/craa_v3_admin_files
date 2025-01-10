import { observer } from 'mobx-react'
import { Box, Checkbox, Select, TextField } from 'src/ui/core/components'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { FormLabel, Stack } from '@mui/material'
import Editor from 'src/ui/core/components/Editor/Editor'
import { useRootStore } from 'src/stores'
export enum AgreementKind {
  PrivacyPolicy = 'privacyPolicy',
  TermsOfService = 'termsOfService',
}
function AgreementView() {
  const {
    agreementStore,
    uiState: { agreements },
  } = useRootStore()
  const kindOptions = [
    {
      text: AgreementKind.PrivacyPolicy,
      value: AgreementKind.PrivacyPolicy,
    },
    {
      text: AgreementKind.TermsOfService,
      value: AgreementKind.TermsOfService,
    },
  ]
  return (
    <DetailLayout store={agreementStore} mutate={agreements.mutate}>
      <Stack spacing={2} sx={{ p: 2, bgcolor: 'white' }}>
        <TextField state={agreementStore} path="form.label" label="Label" />
        <Box>
          <Checkbox
            size="medium"
            state={agreementStore}
            path="form.isRequired"
            label="Required"
          />
          <FormLabel>this agreement is required</FormLabel>
        </Box>

        <FormLabel>type</FormLabel>
        <Select options={kindOptions} state={agreementStore} path="form.kind" />
        <TextField state={agreementStore} path="form.key" label="key" />

        <Editor state={agreementStore} path="form.htmlContent" />
      </Stack>
    </DetailLayout>
  )
}
export default observer(AgreementView)
