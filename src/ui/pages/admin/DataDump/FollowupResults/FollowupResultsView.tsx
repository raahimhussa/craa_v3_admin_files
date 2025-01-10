import * as XLSX from 'xlsx'

import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import {
  Button,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import { AdminLogScreen } from 'src/utils/status'
import Domains from './Domains/Domains'
import Findings from './Findings/Findings'
import OverallUsers from './OverallUsers/OverallUsers'
import Pills from './Pills/Pills'
import Severities from './Severities/Severities'
import TTCs from './TTCs/TTCs'
import User from 'src/models/user'
import _ from 'lodash'
import axios from 'axios'
import download from 'js-file-download'
import moment from 'moment'
import { observer } from 'mobx-react'

// import * as XLSXStyle from 'xlsx-js-style'

type Props = {
  dataDump: {
    identifiedFindings: {
      [findingId: string]: { findingId: string; userIds: string[] }
    }
    notIdentifiedFindingsByUser: {
      findingVisibleId: string
      findingText: string
      severity: string
      domainName: string
      users: string[]
      identifiedCount: string
      identifiedPercent: string
    }[]
    scoresByDomain: {
      domainName: string
      identifiedPercent: string
    }[]
    scoresByMainDomain: {
      domainName: string
      identifiedPercent: string
    }[]
    scoresBySeverity: {
      [severity: number]: { mean: number; high: number; low: number }
    }
    totalTimesToComplete: { mean: number; high: number; low: number }
    pills: {
      documentId: number
      documentName: string
      numberOfPillsTakenBySubject: string
      numberOfPillsPrescribed: string
      percentCompliance: string
      rescueMedication: string
    }[]
    overallsByUser: {
      headers: string[]
      rows: {
        [userId: string]: {
          userName: string
          isUserActivated: string
          id: string
          userTitle: string
          countryName: string
          vendor: string
          bu: string
          region: string
          exp: string
          clinicalExp: string
          intDev: string
          type: string
          degree: string
          certification: string
          manager: string
          domainTotal: string
          criticalIdentified: string
          majorIdentified: string
          minorIdentified: string
          time: string
          numberOfPillsTaken: string
          numberOfPillsShouldTaken: string
          compliancePercent: string
          rescueMedication: string
          numberOfMonitoringNotes: string
          distributedDate: string
          reviewedBaselineResult: string
          baselineScoreByDomain: {
            text: string
            assigned: boolean
            passed: boolean
          }[]
          numberOfTrainingModuleAssigned: string
          followupScoreByDomain: {
            text: string
            assigned: boolean
            passed: boolean
          }[]
          difference: {
            text: string
            passed: boolean
          }[]
          quizScore: { text: string; assigned: boolean }[]
          trainingModulesRemaining: string
          followupSimulationRemaining: string
          isAllModulesCompleted: string
          unusualBehavior: string
          minimumEffort: string
          grade: string
        }
      }
    }
    userIds: string[]
    users: User[]
  }
  currentDataDump: {
    assessmentCycleId: string
    assessmentTypeId: string
    clientUnitId: string
    businessUnitId: string
    businessCycleId: string
  }
}

const BaselineResultsView = ({
  dataDump: {
    identifiedFindings,
    notIdentifiedFindingsByUser,
    scoresByDomain,
    scoresByMainDomain,
    scoresBySeverity,
    totalTimesToComplete,
    pills,
    overallsByUser,
    userIds,
    users,
  },
  currentDataDump,
}: Props) => {
  const onClickExport = async () => {
    // const datadumpDomainsTable = document.getElementById(
    //   'datadump-domains-table'
    // )
    // const datadumpFindingsTable = document.getElementById(
    //   'datadump-findings-table'
    // )
    // const datadumpOverallUsersTable = document.getElementById(
    //   'datadump-overallusers-table'
    // )
    // const datadumpPillsTable = document.getElementById('datadump-pills-table')
    // const datadumpSeveritiesTable = document.getElementById(
    //   'datadump-severities-table'
    // )
    // const datadumpTTCsTable = document.getElementById('datadump-ttcs-table')
    // const tmp_ws1 = XLSX.utils.sheet_to_json(
    //   XLSX.utils.table_to_sheet(datadumpDomainsTable),
    //   { header: 1 }
    // )
    // const tmp_ws2 = XLSX.utils.sheet_to_json(
    //   XLSX.utils.table_to_sheet(datadumpFindingsTable),
    //   { header: 1 }
    // )
    // const tmp_ws3 = XLSX.utils.sheet_to_json(
    //   XLSX.utils.table_to_sheet(datadumpOverallUsersTable),
    //   { header: 1 }
    // )
    // const tmp_ws4 = XLSX.utils.sheet_to_json(
    //   XLSX.utils.table_to_sheet(datadumpPillsTable),
    //   { header: 1 }
    // )
    // const tmp_ws5 = XLSX.utils.sheet_to_json(
    //   XLSX.utils.table_to_sheet(datadumpSeveritiesTable),
    //   { header: 1 }
    // )
    // const tmp_ws6 = XLSX.utils.sheet_to_json(
    //   XLSX.utils.table_to_sheet(datadumpTTCsTable),
    //   { header: 1 }
    // )

    // const ws1 = XLSX.utils.json_to_sheet(
    //   tmp_ws5
    //     .concat([''])
    //     .concat(tmp_ws1)
    //     .concat([''])
    //     .concat(tmp_ws6)
    //     .concat([''])
    //     .concat(tmp_ws4)
    //     .concat([''])
    //     .concat(tmp_ws2)
    //     .concat([''])
    //     .concat(tmp_ws3),
    //   {
    //     skipHeader: true,
    //   }
    // )
    // const ws2 = XLSX.utils.json_to_sheet(tmp_ws2, {
    //   skipHeader: true,
    // })
    // const ws3 = XLSX.utils.json_to_sheet(tmp_ws3, {
    //   skipHeader: true,
    // })

    // const wb = XLSX.utils.book_new()
    // XLSX.utils.book_append_sheet(wb, ws1, 'Overview')
    // XLSX.utils.book_append_sheet(wb, ws2, 'Findings')
    // XLSX.utils.book_append_sheet(wb, ws3, 'User Progress')

    // XLSX.writeFile(wb, `${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`)
    const { data } = await axios.get('v3/datadump/followupDataDump/excel', {
      params: currentDataDump,
      responseType: 'blob',
    })
    download(data, `datadump-${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`)
    // const wb = XLSX.read(data.data, { type: 'buffer' })
    // XLSX.writeFile(wb, 'tmp.xlsx')
    const adminLogManager = AdminLogManager.getInstance()
    await adminLogManager?.createExportLog({
      screen: AdminLogScreen.DataDump,
      target: { type: AdminLogTargetType.DataDump, message: 'followup' },
    })
  }
  return (
    <>
      <Button onClick={onClickExport}>Export</Button>
      <Stack spacing={4} sx={{ width: '100%' }}>
        <Severities scoresBySeverity={scoresBySeverity} />
        <Domains scoresByDomain={scoresByDomain} />
        <TTCs totalTimesToComplete={totalTimesToComplete} />
        <Pills pills={pills} />
        <Findings
          identifiedFindings={identifiedFindings}
          notIdentifiedFindingsByUser={notIdentifiedFindingsByUser}
          users={users}
        />
        <OverallUsers
          overallsByUser={overallsByUser}
          currentDataDump={currentDataDump}
        />
      </Stack>
    </>
  )
}

export default observer(BaselineResultsView)
