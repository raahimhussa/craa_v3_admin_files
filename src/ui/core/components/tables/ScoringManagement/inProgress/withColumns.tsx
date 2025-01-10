import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import {
  AdminLogScreen,
  AssessmentStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { AppBar, IconButton, Modal, Toolbar, CircularProgress } from '@mui/material'
import { Badge, Circle } from '@mui/icons-material'
import { Button, Typography } from 'src/ui/core/components'
import { green, yellow } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'

import { AdminLogManager } from 'src/classes/adminLogManager'
import Assessment from 'src/models/assessment'
import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import Box from '@mui/material/Box'
import { CellProps } from 'react-table'
// import { EnhancedAssessment } from 'src/ui/pages/admin/Reporting/ReportingView'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import PreviewButton from './PreviewButton/PreviewButton'
import PublishButton from './PublishButton/PublishButton'
import RetractButton from './RetractButton/RetractButton'
import ScorerSelect from './ScorerSelect'
import StatusSelect from './StatusSelect'
import UserSimulation from 'src/models/userSimulation'
import UserSimulationRepository from 'src/repos/v2/userSimulation'
import { WrappingFunction } from '@shopify/react-compose'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import palette from 'src/theme/palette'
import { toJS } from 'mobx'
import { useEffect, useState, useRef } from 'react'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

interface NamedObject {
  name: string;
}

const withColumns: WrappingFunction = (WrappedComponent) => {    
  // observer(({roles, users, clientunits, ...props}) => {
  return ({roles, users, clientunits, ...props}) => {    

    const { enqueueSnackbar } = useSnackbar();

    const [render, setRender] = useState(false);

    const clients = clientunits || [];
    const clientDict: { [key: string]: NamedObject } = {};
    const buDict: { [key: string]: NamedObject } = {};

    clients.map((c: any) => {
      if(!clientDict[c._id]) {
        clientDict[c._id] = c;

        if(c.businessUnits) {
          c.businessUnits.map((b: any) => {
            if(!buDict[b._id]) {
              buDict[b._id] = b;
            }
          })
        }
      }
    })

    const {
      uiState: { modal },
      scoringManagementStore,
    } = useRootStore()

    const {
      scoringManagementMutate: mutate,
    }: { scoringManagementMutate: any } = props

    useEffect(() => {
      scoringManagementStore.notPublishedTableMutate =
        props.scoringManagementMutate
      scoringManagementStore.notPublishedTableCountMutate = props.countMutate
    }, [props.scoringManagementMutate, props.countMutate])

    const publishMutate = async () => {
      mutate && (await mutate())
      scoringManagementStore.publishedTableMutate &&
        (await scoringManagementStore.publishedTableMutate())
      scoringManagementStore.publishedTableCountMutate &&
        (await scoringManagementStore.publishedTableCountMutate())
    }

    const columns: Array<AdminColumn> = [
      {
        Header: 'Due Date',
        width: 100,
        Cell: (cellProps: any) => {
          const startDate = new Date(cellProps.row.original.createdAt) as Date
          const deadline = cellProps.row.original.userSimulation
            .deadline as number
          const dueDate = new Date(
            new Date().setDate(startDate.getDate() + deadline)
          )

          return <Box>{moment(dueDate).format('MM-DD-YYYY')}</Box>
        },
      },
      {
        Header: 'Group Due Date',
        width: 100,
        Cell: (cellProps: any) => {
          const relatedAssessments = cellProps.row.original
            .relatedAssessments as (Assessment & {
            userSimulation: UserSimulation
          })[]
          const userBaseline = relatedAssessments?.find(
            (_assessment) =>
              _assessment.userSimulation.simulationType ===
              SimulationType.Baseline
          )?.userSimulation
          if (
            !userBaseline ||
            userBaseline.status !== UserSimulationStatus.Distributed
          )
            return <Box />
          const notPassedDomains =
            userBaseline.results?.scoreByMainDomain.filter(
              (_scoreByMainDomain) => !_scoreByMainDomain.pass
            )
          const startDate = new Date(cellProps.row.original.createdAt) as Date
          const deadline = cellProps.row.original.userSimulation
            .deadline as number
          const dueDate = new Date(
            new Date().setDate(startDate.getDate() + deadline)
          )
          if (notPassedDomains && notPassedDomains.length === 0) {
            return <Box>{moment(dueDate).format('MM-DD-YYYY')}</Box>
          } else if (
            notPassedDomains &&
            notPassedDomains.length > relatedAssessments.length - 1
          ) {
            return <Box />
          }
          let lastDueDate = dueDate
          relatedAssessments.forEach((_relatedAssessment) => {
            const _startDate = new Date(_relatedAssessment.createdAt)
            const _deadline = _relatedAssessment.userSimulation.deadline
            const _dueDate = new Date(
              new Date().setDate(_startDate.getDate() + _deadline)
            )
            if (_dueDate > lastDueDate) {
              lastDueDate = _dueDate
            }
          })

          return <Box>{moment(lastDueDate).format('MM-DD-YYYY')}</Box>
        },
      },
      {
        Header: 'Date Completed',
        accessor: 'userSimulation.submittedAt',
        type: Type.Date,
        width: 100,
        Cell: (cellProps: any) => {          
          return moment(cellProps.value).format('MM-DD-YYYY');          
        }
      },      
      {
        Header: 'Client',
        accessor: 'userSimulation.user.profile.clientUnitId',
        type: Type.String,
        width: 100,
        Cell: (cellProps: any) => {                    
          const cid = cellProps.value;
          const buid = cellProps.row.original.userSimulation.user?.profile.businessUnitId;
        
          const clientName = (clientDict[cid]?.name || '') + (clientDict[cid] && buDict[buid] ? '-' : '') + (buDict[buid]?.name || '');
          return clientName;          
        } 
      },      
      {
        Header: 'Simulation',
        accessor: 'userSimulation.simulation.name',
        type: Type.String,
        width: 100,
      },
      {
        Header: 'First Name',
        accessor: 'userSimulation.user.profile.firstName',
        type: Type.String,
        width: 100,
      },
      {
        Header: 'Last Name',
        accessor: 'userSimulation.user.profile.lastName',
        type: Type.String,
        width: 100,
      },
      {
        Header: 'Initial',
        accessor: 'userSimulation.user.profile.initial',
        type: Type.String,
        width: 100,
      },      
      {
        Header: 'Scorer1',
        accessor: 'firstScorer._id',
        type: Type.String,
        width: 200,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <ScorerSelect
            {...cellProps}
            path="firstScorer._id"
            mutate={mutate}
            userSimulation={cellProps.row.original.userSimulation}
            roles={roles}
            users={users}
          />
        ),
      },
      {
        id: 'scorer1_status',
        Header: 'Status',
        accessor: 'status',
        type: Type.String,
        width: 700,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <StatusSelect
            {...cellProps}
            type={AssessmentScorerType.FirstScorer}
            mutate={mutate}
            userSimulation={cellProps.row.original.userSimulation}
          />
        ),
      },
      {
        Header: 'Scorer2',
        accessor: 'secondScorer._id',
        type: Type.String,
        width: 100,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <ScorerSelect
            {...cellProps}
            path="secondScorer._id"
            mutate={mutate}
            userSimulation={cellProps.row.original.userSimulation}
            roles={roles}
            users={users}
          />
        ),
      },
      {
        id: 'scorer2_status',
        Header: 'Status',
        // accessor: 'secondScorerId',
        type: Type.String,
        width: 300,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <StatusSelect
            {...cellProps}
            type={AssessmentScorerType.SecondScorer}
            mutate={mutate}
            userSimulation={cellProps.row.original.userSimulation}
          />
        ),
      },
      {
        Header: 'Adjudicator',
        accessor: 'adjudicator',
        type: Type.String,
        width: 100,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <ScorerSelect
            {...cellProps}
            path="adjudicator._id"
            mutate={mutate}
            userSimulation={cellProps.row.original.userSimulation}
            roles={roles}
            users={users}
          />
        ),
      },
      {
        id: 'adjudicator_status',
        Header: 'Status',
        // accessor: 'secondScorerId',
        type: Type.String,
        width: 300,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <StatusSelect
            {...cellProps}
            type={AssessmentScorerType.Adjudicator}
            mutate={mutate}
            userSimulation={cellProps.row.original.userSimulation}
          />
        ),
      },
      {
        Header: 'Publish',
        type: Type.String,
        width: 200,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => {
          const {
            row: { original: assessment },
          } = cellProps
          return (
            <PublishButton
              assessment={assessment}
              userSimulation={assessment.userSimulation}
              mutate={publishMutate}
            />
          )
        },
      },
      // {
      //   Header: 'Preview',
      //   type: Type.String,
      //   width: 200,
      //   Cell: observer(
      //     (
      //       cellProps: CellProps<
      //         Assessment & { userSimulation: UserSimulation }
      //       >
      //     ) => {
      //       const {
      //         row: { original: assessment },
      //       } = cellProps
      //       return (
      //         <PreviewButton
      //           assessment={assessment}
      //           userSimulation={assessment.userSimulation}
      //           mutate={mutate}
      //         />
      //       )
      //     }
      //   ),
      // },
      {
        Header: 'Expedited',
        accessor: 'isExpedited',
        type: Type.String,
        minWidth: 400,
        Cell: (cellProps: any) => {
          const adminLogManager = AdminLogManager.getInstance()
          const assessment = cellProps.row.original;

          const [loading, setLoading] = useState(false);
          const [isExpedited, setIsExpedited] = useState(assessment.isExpedited);
          const [isPreExpedited, setIsPreExpedited] = useState(false);   
          const [initialIsExpedited] = useState(assessment.isExpedited);        

          const isMounted = useRef(true);  // add this line

          useEffect(() => {
            return () => {
              isMounted.current = false;  // update the mounted status when the component is unmounted
            };
          }, []);

          // const onClick = async () => {
          //   setLoading(true); 
            
          //   if (confirm('Are you sure you want to continue?')) {

          //     const filter = {
          //       _id: assessment._id,
          //     }
          //     const update = {
          //       isExpedited: !assessment.isExpedited,
          //     }
          //     const response = await axios.patch('/v2/assessments', {
          //       filter,
          //       update,
          //     })

          //     if (response.status === 200 && isMounted.current) {
          //       setIsExpedited(!isExpedited);
          //       setIsPreExpedited(true);
          //       setRender(!render);  // Force a re-render
                
          //       alert('Successfully done.');
          //     }

          //     // await adminLogManager?.createExpediteSimulationLog({
          //     //   screen: AdminLogScreen.ScoringManagement,
          //     //   target: {
          //     //     type: 'assessments',
          //     //     _id: assessment._id,
          //     //     message: 'expedite',
          //     //   },
          //     // })
          //     // mutate && (await mutate())
          //   }

          //   if (isMounted.current) {  // check the mounted status before updating state
          //     setLoading(false);
          //   }            
          // }

          useEffect(() => {
            const fetchData = async () => {
              if (initialIsExpedited !== isExpedited) {
                // if (confirm('Are you sure you want to continue?')) {
                  const filter = {
                    _id: assessment._id,
                  }
                  const update = {
                    isExpedited: isExpedited,
                  }
                  setLoading(true);
                  const response = await axios.patch('/v2/assessments', {
                    filter,
                    update,
                  })
        
                  if (response.status === 200 && isMounted.current) {
                    // setIsExpedited((prevIsExpedited: boolean) => !prevIsExpedited);
                    // setIsPreExpedited(!isPreExpedited);
                    // alert('Successfully done.');
                    enqueueSnackbar(isExpedited ? 'Successfully expedited.' : 'Expedite state revoked.', {
                      variant: 'success',
                    })
                  }
                  setLoading(false);
                // }
              }
            };
            fetchData();
          }, [isExpedited]); 

          // const buttonColor = initialIsExpedited || isPreExpedited  ? palette.light.button.red : palette.light.button.point;
          // const buttonText = initialIsExpedited || isPreExpedited ? 'Expedited' : 'Expedite';   
          const buttonColor = isExpedited ? palette.light.button.red : palette.light.button.point;
          const buttonText = isExpedited ? 'Expedited' : 'Expedite';                  

          // console.log(cellProps);
          // console.log(isPreExpedited, isExpedited, buttonColor);
          // console.log(isPreExpedited);
          return (
            <Box sx={{ width: '130px' }}>
              {/* {true ? ( */}
              {!loading ? (  
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: buttonColor,
                    width: '100px',
                  }}
                  // onClick={onClick}
                  onClick={() => setIsExpedited((prevIsExpedited: boolean) => !prevIsExpedited)}
                >
                  {buttonText}
                </Button>
              ) : (
                <Box>
                  {/* <Circle htmlColor="green" /> */}
                  <CircularProgress size={30} />
                </Box>
              )}
            </Box>
          )
        },
      },
    ]

    const meta = {
      columns,
    }
  
    return <WrappedComponent {...props} {...meta} />
  }
}
  // )

export default withColumns
