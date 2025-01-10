import * as moment from 'moment'
import * as xlsx from 'xlsx'

import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withLeftButtons: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { state } = props
    const { userAssessmentCycleStore } = useRootStore()

    const leftButtons = [
      {
        title: 'Export',
        onClick: async () => {
          try {
            const { data } = await axios.get(
              'v1/userAssessmentCycles/userStatusManagement/excel',
              {
                params: {
                  filter: { isDeleted: false },
                  options: {
                    multi: true,
                    fields: {
                      status: 0,
                      result: 0,
                      verified: 0,
                      invoiced: 1,
                      minEffort: 0,
                      signOff: 0,
                      behavior: 0,
                    },
                    comment: {
                      fromValue:
                        userAssessmentCycleStore.invoicedFromValue?.toDate(),
                      toValue:
                        userAssessmentCycleStore.invoicedToValue?.toDate(),
                    },
                  },
                },
              }
            )
            const wb = xlsx.read(data, {
              type: 'binary',
            })
            xlsx.writeFile(
              wb,
              `invoiced-user-${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`
            )
          } catch (e) {
            console.error(e)
          }
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
