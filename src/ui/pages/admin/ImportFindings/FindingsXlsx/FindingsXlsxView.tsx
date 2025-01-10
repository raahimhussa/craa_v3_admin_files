// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'

import { Box, Button } from '@mui/material'
import {
  DataSheetGrid,
  intColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import { read, utils } from 'xlsx'
import { useEffect, useRef, useState } from 'react'

import Domain from 'src/models/domain'
import Finding from 'src/models/finding'
import Folder from 'src/models/folder'
import SimDoc from 'src/models/simDoc'
import Simulation from 'src/models/simulation'
// import ReactDataSheet from 'react-datasheet'
import { Utils } from '@utils'
import _ from 'lodash'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useSWRConfig } from 'swr'
import { useSnackbar } from 'notistack'

type Props = {
  file: File
  simulations: Simulation[]
  simDocs: SimDoc[]
  domains: Domain[]
  folders: Folder[]
  findings: Finding[]
  simulationMappers: { simulationId: number; findingId: number }[]
}

type Row = {
  // id: number | null
  finding: string | null
  simulation_id: number | null
  main_document_id: number | null
  compare_with_1: number | null
  compare_with_2: number | null
  severity: string | null
  cfr: string | null
  ich_gcp: string | null
  domain: string | null
  domain_id: number | null
}

const header = [
  // 'id',
  'finding',
  'simulation_id',
  'main_document_id',
  'compare_with_1',
  'compare_with_2',
  'severity',
  'cfr',
  'ich_gcp',
  'domain',
  'domain_id',
]

const FindingsXlsxView = observer(
  ({
    file,
    simDocs,
    simulations,
    domains,
    folders,
    findings,
    simulationMappers,
  }: Props) => {
    const { cache, mutate } = useSWRConfig()
    const canSave = useRef<boolean>(true)
    const [data, setData] = useState<Row[]>([])
    const {
      uiState: { modal },
    } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
      if (!file) return
      handleFile(file)
    }, [file])

    const columns = [
      // { ...keyColumn<Row, 'id'>('id', intColumn), title: 'id' },
      { ...keyColumn<Row, 'finding'>('finding', textColumn), title: 'finding' },
      {
        ...keyColumn<Row, 'simulation_id'>('simulation_id', intColumn),
        title: 'simulation_id',
      },
      {
        ...keyColumn<Row, 'main_document_id'>('main_document_id', intColumn),
        title: 'main_document_id',
      },
      {
        ...keyColumn<Row, 'compare_with_1'>('compare_with_1', intColumn),
        title: 'compare_with_1',
      },
      {
        ...keyColumn<Row, 'compare_with_2'>('compare_with_2', intColumn),
        title: 'compare_with_2',
      },
      {
        ...keyColumn<Row, 'severity'>('severity', textColumn),
        title: 'severity',
      },
      { ...keyColumn<Row, 'cfr'>('cfr', textColumn), title: 'cfr' },
      { ...keyColumn<Row, 'ich_gcp'>('ich_gcp', textColumn), title: 'ich_gcp' },
      { ...keyColumn<Row, 'domain'>('domain', textColumn), title: 'domain' },
      {
        ...keyColumn<Row, 'domain_id'>('domain_id', intColumn),
        title: 'domain_id',
      },
    ]

    const handleFile = (file: File /*:File*/) => {
      /* Boilerplate to set up FileReader */
      const reader = new FileReader()
      const rABS = !!reader.readAsBinaryString
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target?.result
        const wb = read(bstr, { type: rABS ? 'binary' : 'array' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        /* Convert array of arrays */
        const jsonData = utils.sheet_to_json<any[]>(ws, {
          header: 1,
          defval: '',
        })
        const convertedData = convertFormat(jsonData)
        const rows: any[] | ((prevState: Row[]) => Row[]) = []
        const inputDataHeader: string[] = []

        convertedData.forEach((row, i) => {
          const _row: any = {}
          row.forEach((column, j) => {
            if (i === 0) {
              inputDataHeader.push(column.value)
              return
            }
            const columnHeader = inputDataHeader[j]
            _row[columnHeader] = column.value
          })
          if (i === 0) return
          rows.push(_row)
        })
        /* Update state */
        setData(rows)
      }
      if (rABS) reader.readAsBinaryString(file)
      else reader.readAsArrayBuffer(file)
    }

    const onClickSave = async () => {
      if (!canSave.current) {
        return enqueueSnackbar('Please correct the fields with error.', {
          variant: 'error',
        })
      }
      try {
        modal.close()
        await axios.post('v2/findings/bulkCreate', data)
        Utils.matchMutate(cache, mutate, 'v2/findings')
        setData([])
        enqueueSnackbar('Imported successfully', {
          variant: 'success',
        })
      } catch (e) {
        console.log(e)
        enqueueSnackbar('Error', {
          variant: 'error',
        })
      }
    }

    const onClickCancel = () => {
      modal.close()
      setData([])
    }

    const getCellClassName = ({
      rowData,
      rowIndex,
      columnId,
    }: {
      rowData: Row
      rowIndex: number
      columnId?: string
    }) => {
      if (rowIndex === 0 && !columnId) {
        canSave.current = true
      }
      let className = ''
      if (!columnId) return className

      const value = rowData[columnId as keyof Row]
      switch (columnId) {
        case 'finding': {
          if (!value) {
            className = 'dsg-cell-error'
            break
          }
          const main_document_id =
            typeof rowData.main_document_id === 'number'
              ? rowData.main_document_id
              : parseInt(rowData.main_document_id || '')
          const simulation_id =
            typeof rowData.simulation_id === 'number'
              ? rowData.simulation_id
              : parseInt(rowData.simulation_id || '')
          if (!isNaN(main_document_id) && !isNaN(simulation_id)) {
            const simDocFindings = findings.filter((_finding) =>
              simDocs.find((_simDoc) => _simDoc.visibleId === main_document_id)
            )
            // const simulationFindings = simulationMappers.find(_sm => _sm.)
            const currentlyExist = simDocFindings.find(
              (_finding) => _finding.text === value
            )
              ? true
              : false
            if (currentlyExist) {
              className = 'dsg-cell-warning'
            }
            break
          }
          if (!isNaN(main_document_id) || !isNaN(simulation_id)) {
            className = 'dsg-cell-error'
          }
          break
        }
        case 'simulation_id': {
          const simulation_id =
            typeof value === 'number' ? value : parseInt(value || '')
          if (
            !isNaN(simulation_id) &&
            !simulations.find(
              (_simulation) => _simulation.visibleId === simulation_id
            )
          ) {
            className = 'dsg-cell-error'
            break
          }
          break
        }
        case 'main_document_id': {
          const main_document_id =
            typeof value === 'number' ? value : parseInt(value || '')
          if (isNaN(main_document_id)) break
          if (
            !simDocs.find((_simDoc) => _simDoc.visibleId === main_document_id)
          ) {
            className = 'dsg-cell-error'
            break
          }
          const d1 =
            simulations.find(
              (_simulation) => _simulation.visibleId === rowData.simulation_id
            )?.folderIds || []
          const d2 = folders
            .filter((_folder) => d1.includes(_folder.folderId))
            .map((_folder) => _folder._id as string)
          const f = [...d1, ...d2]
          const s = simDocs
            .filter(
              (_simDoc) => _simDoc.folderId && f.includes(_simDoc.folderId)
            )
            .map((_simDoc) => _simDoc.visibleId)
          if (
            !s.find((_simDocVisibleId) => _simDocVisibleId === main_document_id)
          ) {
            className = 'dsg-cell-error'
            break
          }
          break
        }
        case 'compare_with_1': {
          const compare_with_1 =
            typeof value === 'number' ? value : parseInt(value || '')
          if (isNaN(compare_with_1)) break
          if (
            !simDocs.find((_simDoc) => _simDoc.visibleId === compare_with_1)
          ) {
            className = 'dsg-cell-error'
            break
          }
          break
        }
        case 'compare_with_2': {
          const compare_with_2 =
            typeof value === 'number' ? value : parseInt(value || '')
          if (isNaN(compare_with_2)) break
          if (
            !simDocs.find((_simDoc) => _simDoc.visibleId === compare_with_2)
          ) {
            className = 'dsg-cell-error'
            break
          }
          break
        }
        case 'severity': {
          const severity = value
          if (
            severity === 'Critical' ||
            severity === 'Major' ||
            severity === 'Minor' ||
            !severity
          ) {
            break
          }
          className = 'dsg-cell-error'
          break
        }
        case 'domain': {
          const domain = value
          const domain_id = rowData.domain_id
          if (!domain_id) break
          const foundDomains = domains.filter(
            (_domain) => _domain.visibleId === domain_id
          )
          if (foundDomains.length > 0) {
            if (
              foundDomains.find((_foundDomain) => _foundDomain.name === domain)
            )
              break
            className = 'dsg-cell-warning'
            break
          }
          break
        }
        case 'domain_id': {
          const domain_id =
            typeof value === 'number' ? value : parseInt(value || '')
          if (isNaN(domain_id)) {
            className = 'dsg-cell-error'
            break
          }
          if (!domains.find((_domain) => _domain.visibleId === domain_id)) {
            className = 'dsg-cell-error'
            break
          }
          break
        }
      }
      if (className === 'dsg-cell-error') {
        canSave.current = false
      }
      return className
    }

    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '72px',
          }}
        >
          <Button onClick={onClickSave} sx={{ marginRight: '24px' }}>
            save
          </Button>
          <Button onClick={onClickCancel} sx={{ marginRight: '24px' }}>
            cancel
          </Button>
        </Box>
        <Box
          // className="datasheet-container"
          sx={{
            bgcolor: 'white',
            height: 'calc(100vh - 72px)',
            overflow: 'auto',
          }}
        >
          {data ? (
            <Box>
              <DataSheetGrid<Row>
                value={data}
                onChange={(value, operations) => {
                  setData(value)
                }}
                // cellClassName={getCellClassName}
                cellClassName={({ rowData, rowIndex, columnId }) => {
                  return getCellClassName({
                    rowData: rowData as Row,
                    rowIndex,
                    columnId,
                  })
                }}
                columns={columns}
                gutterColumn={{
                  component: ({ deleteRow }) => (
                    <button className="dsg-delete-button" onClick={deleteRow}>
                      ❌
                    </button>
                  ),
                }}
              />
            </Box>
          ) : null}
        </Box>
      </Box>
    )
  }
)

export default compose<any>()(FindingsXlsxView)

const convertFormat = (jsonData: any[][]) => {
  return jsonData.map((row) =>
    row.map((column) => ({
      value: column,
    }))
  )
}
