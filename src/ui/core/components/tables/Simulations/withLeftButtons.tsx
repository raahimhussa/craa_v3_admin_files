import Simulation from 'src/ui/pages/admin/Simulation/Simulation'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import download from 'js-file-download'
import moment from 'moment'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, simulationsMutate } = props
    const {
      uiState: { modal },
      simulationStore,
    } = useRootStore()

    const leftButtons = [
      {
        title: 'Export',
        onClick: async () => {
          const { data } = await axios.get('v1/simulations/excel', {
            responseType: 'blob',
          })
          download(
            data,
            `simulations-${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`
          )
        },
        color: 'primary',
      },
      {
        title: 'NEW',
        onClick: () => {
          simulationStore.resetForm()
          modal.open('Simulation', <Simulation mutate={simulationsMutate} />)
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
