import Templates from 'src/ui/core/components/tables/Templates/Templates'
import { observer } from 'mobx-react'
function TemplatesView({ templates, templatesMutate }: any) {
  return <Templates templates={templates} templatesMutate={templatesMutate} />
}
export default observer(TemplatesView)
