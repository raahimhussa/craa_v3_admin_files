import {
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import Assessment from 'src/models/assessment'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

const ProcessIssuesView = ({
  viewports,
  setProcess,
}: {
  viewports: any[]
  setProcess: any
}) => {
  const [notViewedSimDoc, setNotViewedSimDoc] = useState([])

  async function getResult() {
    let arr: string[] = []
    viewports.map((viewport) => {
      arr.push(...viewport.viewedSimDocIds)
    })
    //@ts-ignore
    const viewedSimDocIds = [...new Set(arr)]

    const { data } = await axios.get(
      `v2/findings/simulations/${viewports[0].simulationId}/simDocs`
    )
    let simDocIds: any[] = []
    Object.values(data).map((folder: any) => {
      folder.map((doc: any) => {
        simDocIds.push(doc)
      })
    })
    let notViewedSimDocs: string[] = []
    simDocIds.map((doc) => {
      if (!viewedSimDocIds.includes(doc._id)) {
        notViewedSimDocs.push(doc.title)
      }
    })
    //@ts-ignore
    setNotViewedSimDoc(notViewedSimDocs)
  }

  useEffect(() => {
    getResult()
  }, [])

  useEffect(() => {
    let column: string[] = ['Process', 'Result', 'Documents']
    let row: any = [
      [
        'Documents not reviewed',
        notViewedSimDoc.length,
        notViewedSimDoc.join('\n'),
      ],
      ['Non-errors identified by CRA', 0, ' '],
    ]
    setProcess({ rows: row, column: column })
  }, [notViewedSimDoc])

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 0.5, mt: 4 }}>
        Process Issues
      </Typography>
      <Card className="preview_card" sx={{ width: '50%' }}>
        <Table className="preview_table">
          <TableHead>
            <TableCell>Process</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Documents</TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, width: '30%' }}>
                Documents not reviewed
              </TableCell>
              <TableCell sx={{ width: '8%' }}>
                {notViewedSimDoc.length}
              </TableCell>
              <TableCell>
                {notViewedSimDoc.map((doc) => {
                  return (
                    <Typography sx={{ fontSize: '13px' }}>{doc}</Typography>
                  )
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>
                Non-errors identified by CRA
              </TableCell>
              <TableCell>0</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  )
}
export default compose<any>(
  withFind({
    collectionName: 'viewports',
    version: 2,
    getFilter: (props: any) => ({
      userSimulationId: props.userSimulationId,
    }),
  })
)(observer(ProcessIssuesView))
