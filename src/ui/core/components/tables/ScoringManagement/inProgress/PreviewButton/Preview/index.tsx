import { Box, Button, Paper } from '@mui/material'

import Answer from 'src/models/answer'
import Assessment from 'src/models/assessment'
import ComplianceCalculationScore from './sections/ComplianceCalculationScore'
import Domain from 'src/models/domain'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import Finding from 'src/models/finding'
import FindingScore from './sections/FindingScore'
import MonitoringNotes from './sections/MonitoringNotes'
import ProcessIssues from './sections/ProcessIssues'
import ResultsSummary from './sections/ResultsSummary'
import UnidentifiedFindings from './sections/UnidentifiedFindings'
import User from 'src/models/user'
import UserInfo from './sections/UserInfo'
import UserSimulation from 'src/models/userSimulation'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'
import { useState } from 'react'
import withFind from 'src/hocs/withFind'
import withFindOne from 'src/hocs/withFindOne'

const PreviewView = ({
  userSimulation,
  answers,
  findings,
  domains,
  countries,
  setOpenPreview,
  simulations,
}: {
  userSimulation: UserSimulation
  answers: Answer[]
  findings: Finding[]
  domains: Domain[]
  countries: any[]
  setOpenPreview: any
  user: User,
  simulations: any[]
}) => {
  const [resultSummary, setResultSummary] = useState({})
  const [user, setUser] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [findingScore, setFindingScore] = useState({})
  const [compliance, setCompliance] = useState({})
  const [process, setProcess] = useState({})
  const [unidentified, setUnidentified] = useState({})
  const [monitoring, setMonitoring] = useState({})

  async function exportExcel() {
    let datas = {
      resultSummary: {},
      userInfo: {},
      findingScore: {},
      compliance: {},
      process: {},
      unidentified: {},
      monitoring: {},
      user: {},
    }
    datas['resultSummary'] = resultSummary
    datas['userInfo'] = userInfo
    datas['findingScore'] = findingScore
    datas['compliance'] = compliance
    datas['process'] = process
    datas['unidentified'] = unidentified
    datas['monitoring'] = monitoring
    datas['user'] = user

    var form = document.createElement('form') // 폼객체 생성
    var objs
    objs = document.createElement('input') // 값이 들어있는 녀석의 형식
    objs.setAttribute('type', 'text') // 값이 들어있는 녀석의 type
    objs.setAttribute('name', 'data') // 객체이름
    //@ts-ignore
    objs.setAttribute('value', JSON.stringify(datas)) //객체값
    form.appendChild(objs)
    form.setAttribute('method', 'post') //get,post 가능

    // form.setAttribute(
    //   'action',
    //   `https://craa-api-dev-3.hoansoft.com/v3/excel/usercard`
    // ) //보내는 url
    form.setAttribute('action', `http://localhost:4000/v3/excel/usercard`) //보내는 url

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        p: '2rem 3rem',
      }}
    >
      <Button
        variant="contained"
        onClick={exportExcel}
        sx={{
          position: 'absolute',
          boxShadow: 'none',
          right: 0,
          mb: 2,
          mx: 3.5,
          fontWeight: 700,
          bgcolor: palette.light.button.green,
          zIndex: 2,
        }}
      >
        excel
        <FileDownloadIcon
          sx={{
            fontSize: 20,
          }}
        />
      </Button>
      <Paper>
        <Box sx={{ mb: 6 }}>
          <UserInfo
            userId={userSimulation.userId}
            countries={countries}
            setUserInfo={setUserInfo}
            userInfo={userInfo}
            userSimulation={userSimulation}
            setUser={setUser}
            simulations={simulations}    
          />
        </Box>
        <Box sx={{ mb: 6 }}>
          <ResultsSummary
            userSimulation={userSimulation}
            setResultSummary={setResultSummary}
            resultSummary={resultSummary}
          />
        </Box>
        <Box sx={{ mb: 6 }}>
          <FindingScore
            userSimulation={userSimulation}
            domains={domains}
            setFindingScore={setFindingScore}
            findingScore={findingScore}
          />
        </Box>
        <Box sx={{ mb: 6 }}>
          <ComplianceCalculationScore
            userSimulationId={userSimulation._id}
            userId={userSimulation.userId}
            setCompliance={setCompliance}
          />
        </Box>
        <Box sx={{ mb: 6 }}>
          <ProcessIssues
            userSimulationId={userSimulation._id}
            setProcess={setProcess}
          />
        </Box>
        <Box sx={{ mb: 6 }}>
          <UnidentifiedFindings
            userSimulation={userSimulation}
            answers={answers}
            findings={findings}
            domains={domains}
            setUnidentified={setUnidentified}
          />
        </Box>
        <Box>
          <MonitoringNotes
            userSimulationId={userSimulation._id}
            userId={userSimulation.userId}
            setMonitoring={setMonitoring}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default compose<any>(
  withFindOne({
    collectionName: 'userSimulations',
    version: 2,
    getFilter: ({ userSimulationId }: { userSimulationId: string }) => ({
      _id: userSimulationId,
    }),
  }),
  withFind({
    collectionName: 'answers',
    version: 2,
    getFilter: ({ userSimulationId }: { userSimulationId: string }) => ({
      userSimulationId: userSimulationId,
    }),
  }),
  withFind({
    collectionName: 'findings',
    version: 2,
    getOptions: ({ simId }: { simId: string }) => ({
      // fields: {
      //   selectedSimulationId: simId,
      // },
      withJoin: true,
    }),
  }),
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({}),
  }),
  withFind({
    collectionName: 'countries',
    getFilter: () => ({}),
  }),
  withFind({
    collectionName: 'simulations',
    getFilter: () => {
      return {
        idDeleted: false
      }
    }
    // getFilter: ({ userSimulationId }: { userSimulationId: any }) => ({
    //   _id: userSimulationId,
    // }),    
  })
)(observer(PreviewView))
