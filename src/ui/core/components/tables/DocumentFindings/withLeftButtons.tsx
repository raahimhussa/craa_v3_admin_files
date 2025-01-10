import DeleteDialogue from './DeleteDialog/DeleteDialogue'
import Finding from 'src/ui/pages/admin/Finding/Finding'
import FindingSelect from './FindingSelect/FindingSelect'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, findingsMutate, simulationMappersMutate } = props
    const {
      findingStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = [
      {
        title: 'Add Findings',
        onClick: () => {
          // findingStore.resetForm()
          // findingStore.form.simDocId = props?.simDocId ? props.simDocId : ''
          modal.open(
            'AddFindings',
            <FindingSelect
              simDocId={props.simDocId ? props.simDocId : ''}
              prevFindingsMutate={findingsMutate}
              simulationMappersMutate={simulationMappersMutate}
              simulationId={props.simulationId}
            />
          )
        },
        disabled: !props.simulationId,
        color: 'primary',
        // sx: { mr: 1 },
      },
      {
        title: 'Delete',
        onClick: () => {
          if (toJS(state.selectedRowIds).length === 0) return
          const onClickDelete = async () => {
            await axios.delete('v3/simulationMappers', {
              params: {
                filter: {
                  simulationId: props.simulationVisibleId,
                  findingId: props.findings
                    .filter((_finding: { _id: any }) =>
                      toJS(state.selectedRowIds).includes(_finding._id)
                    )
                    .map((_finding: { visibleId: any }) => _finding.visibleId),
                },
              },
            })
            props.simulationMappersMutate &&
              (await props.simulationMappersMutate())
          }
          modal.open(
            'DeleteFinding',
            <DeleteDialogue
              open={true}
              handleClose={() => modal.close()}
              onDelete={onClickDelete}
              title={`Are you sure you want to delete ${
                toJS(state.selectedRowIds).length
              } findings from this Document?`}
              text={
                "This item will be deleted permanently. You can't undo this action."
              }
              yesText={'Delete'}
              noText={'Cancel'}
            />
          )
        },
        disabled: !props.simulationId,
        color: 'primary',
        sx: { mr: 5 },
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
