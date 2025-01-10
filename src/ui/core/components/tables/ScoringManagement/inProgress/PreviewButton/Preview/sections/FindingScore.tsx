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

import Assessment from 'src/models/assessment'
import Domain from 'src/models/domain'
import UserSimulation from 'src/models/userSimulation'
import assessment from 'src/models/assessment'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import withFindOne from 'src/hocs/withFindOne'

const FindingScoreView = ({
  userSimulation,
  domains,
  setFindingScore,
  findingScore,
}: {
  userSimulation: UserSimulation
  domains: Domain[]
  setFindingScore: any
  findingScore: any
}) => {
  const severities = {
    0: 'Critical',
    1: 'Major',
    2: 'Minor',
  }

  useEffect(() => {
    let columns1: string[] = [
      'Severity',
      '% Identified',
      'Identified',
      'Not Identified',
      'Total',
    ]
    let columns2: string[] = [
      'Domain',
      '% Identified',
      'Identified',
      'Not Identified',
      'Total',
    ]
    let rows1: any = []
    let rows2: any = []
    userSimulation?.results?.identifiedScoreBySeverity.map((result, index) => {
      let arr = []
      arr.push(severities[result.severity as 0 | 1 | 2])
      arr.push(
        `${
          result.allFindings.length === 0
            ? 0
            : (
                (result.identifiedFindings.length / result.allFindings.length) *
                100
              ).toFixed(0)
        }%`
      )
      arr.push(result?.identifiedFindings?.length || 0)
      arr.push(result?.notIdentifiedFindings?.length || 0)
      arr.push(result?.allFindings?.length || 0)
      rows1.push(arr)
    })
    userSimulation?.results?.identifiedScoreByMainDomain.map(
      (result, index) => {
        let arr = []
        arr.push(
          domains.find((_domain) => _domain._id === result.domainId)?.name
        )
        arr.push(
          `${
            result.allFindings.length === 0
              ? 0
              : (
                  (result.identifiedFindings.length /
                    result.allFindings.length) *
                  100
                ).toFixed(0)
          }%`
        )
        arr.push(result.identifiedFindings.length)
        arr.push(result.notIdentifiedFindings.length)
        arr.push(result.allFindings.length)
        rows2.push(arr)
      }
    )
    setFindingScore({
      severity: { rows: rows1, columns: columns1 },
      domain: { rows: rows2, columns: columns2 },
    })
  }, [])

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 0.5, mt: 4 }}>
        Finding Score
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Card className="preview_card" sx={{ width: '40%', height: 'auto' }}>
          <Table className="preview_table">
            <TableHead>
              <TableCell>Severity</TableCell>
              <TableCell>% Identified</TableCell>
              <TableCell>Identified</TableCell>
              <TableCell>Not Identified</TableCell>
              <TableCell>Total</TableCell>
            </TableHead>
            <TableBody>
              {userSimulation.results?.identifiedScoreBySeverity.map(
                (result, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {severities[result.severity as 0 | 1 | 2]}
                    </TableCell>
                    <TableCell>
                      {result.allFindings.length === 0
                        ? 0
                        : (
                            (result.identifiedFindings.length /
                              result.allFindings.length) *
                            100
                          ).toFixed(0)}
                      %
                    </TableCell>
                    <TableCell>{result.identifiedFindings.length}</TableCell>
                    <TableCell>
                      {result?.notIdentifiedFindings?.length}
                    </TableCell>
                    <TableCell>{result.allFindings.length}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Card>
        <Card className="preview_card" sx={{ width: '58%' }}>
          <Table className="preview_table">
            <TableHead>
              <TableCell>Domain</TableCell>
              <TableCell>% Identified</TableCell>
              <TableCell>Identified</TableCell>
              <TableCell>Not Identified</TableCell>
              <TableCell>Total</TableCell>
            </TableHead>
            <TableBody>
              {userSimulation.results?.identifiedScoreByMainDomain.map(
                (result, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {
                        domains.find(
                          (_domain) => _domain._id === result.domainId
                        )?.name
                      }
                    </TableCell>
                    <TableCell>
                      {result.allFindings.length === 0
                        ? 0
                        : (
                            (result.identifiedFindings.length /
                              result.allFindings.length) *
                            100
                          ).toFixed(0)}
                      %
                    </TableCell>
                    <TableCell>{result.identifiedFindings.length}</TableCell>
                    <TableCell>{result.notIdentifiedFindings.length}</TableCell>
                    <TableCell>{result.allFindings.length}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </Box>
  )
}
export default compose<any>()(observer(FindingScoreView))
