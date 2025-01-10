import CheckIcon from '@mui/icons-material/Check';

import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { AdminLogScreen } from 'src/utils/status'
import AssessmentType from 'src/ui/pages/admin/modals/AssessmentType/AssessmentType'
import { Button } from '@mui/material'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import DuplicateDialogue from '@components/DuplicateDialogue/DuplicateDialogue'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

import { useSnackbar } from 'notistack'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {

    const { enqueueSnackbar } = useSnackbar()

    const {
      uiState: { modal},
      authStore,
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Path',
        accessor: 'target.path',
        minWidth: 200,
        // Cell: (props: any) => {
        //   const targetPath = props.row.original.target.path;
        //   return targetPath || '';
        // },        
      },
      {
        Header: 'Type',
        accessor: 'target._type',
        minWidth: 200,
      },      
      {
        Header: 'Origin',
        accessor: 'target.origin',
        minWidth: 200,
        // Cell: (props: any) => {
        //   console.log("target.origin: ", props)
        //   // return props.value.toUpperCase()
        // },          
      },      
      {
        Header: 'New',
        accessor: 'target.new',        
        minWidth: 150,
      },
      {
        Header: 'Event',
        accessor: 'event',        
        minWidth: 50,
        Cell: (props: any) => {
          return props.value.toUpperCase()
        },        
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 150,
      },       
      {
        Header: 'Performed By',
        accessor: 'userName',        
        minWidth: 150,
      },      
      {
        Header: 'Reviewed By',
        accessor: 'reviewers',        
        minWidth: 150,
        Cell: (cellProps: CellProps<any>) => {
          if(cellProps?.row?.original?.reviewers) {
            const reviewers = cellProps?.row?.original?.reviewers;
            if(reviewers.length > 0) {
              if(props.adminUsers) {
                let reviewerNames: string[] = []

                props.adminUsers.map((u: any) => {
                  if(reviewers.includes(u._id)) {
                    // reviewerNames.push(u.profile.firstName + ' ' + u.profile.lastName)
                    reviewerNames.push(u.profile.firstName)
                  }
                })                
                return reviewerNames.join(',')
              }
            }            
          }

          return ''
        },         
      },
      {
        Header: 'Action',
        // storeKey: 'assessmentTypeStore',
        // mutateKey: 'assessmentTypes',
        // Cell: CellButtons,
        screen: AdminLogScreen.DocumentChangeLogAudit,
        minWidth: 150,
        // mutate: async () => {
        //   props.assessmentTypesMutate && (await props.assessmentTypesMutate())
        //   props.countMutate && (await props.countMutate())
        // },
        mutate: async () => {
          props.adminLogsMutate && (await props.adminLogsMutate())          
        },        
        edit: () => {
          const mutate = async () => {
            props.assessmentTypesMutate && (await props.assessmentTypesMutate())
            props.countMutate && (await props.countMutate())
          }
          // modal.open('AssessmentType', <AssessmentType mutate={mutate} />)
        },
        Cell: (cellProps: CellProps<any>) => {

          const itsMe = cellProps.row.original.userId === authStore.user._id;

          if(itsMe) {
            return ''
          }
          else {
            const reviewed = cellProps.row.original.reviewers && cellProps.row.original.reviewers.includes(authStore.user._id) || false;

            const onClickMarkAsReviewed = async () => {
              if(!reviewed) {
                const uid = authStore.user._id;

                const body = {
                  filter: {
                    _id: cellProps.row.original._id
                  },
                  update: {
                    $addToSet: {
                      reviewers: uid
                    }
                  }
                }

                const meReviewed = await axios.patch('v2/adminLogs', body);

                if(meReviewed) {
                  enqueueSnackbar('Updated successfully', { variant: 'success' })
                  props.adminLogsMutate && (await props.adminLogsMutate())                   
                }
              }
            }

            return(       
              <Button 
                variant="outlined" 
                startIcon={reviewed ? <CheckIcon /> : null}
                style={{
                  borderColor: reviewed ? '#22bc44 !important' : '#d3220c !important',
                  color: reviewed ? '#22bc44 !important' : '#d3220c !important'
                }}
                onClick={onClickMarkAsReviewed}            
              >
                {reviewed ? 'Reviewed' : 'Mark as Reviewed'}
              </Button>              
            )  
          } 
        } 
      }
      
      // {
      //   Header: 'Duplicate',
      //   width: 100,
      //   Cell: (cellProps: CellProps<any>) => {
      //     const [open, setOpen] = useState<boolean>(false)
      //     const [label, setLabel] = useState<string>(
      //       `${cellProps.row.original.label} copy`
      //     )
      //     const assessmentType = cellProps.row.original

      //     const onClickOpen = () => {
      //       setOpen(true)
      //     }
      //     const onClickDuplicate = async () => {
      //       const _assessmentType = { ...assessmentType }
      //       delete _assessmentType._id
      //       delete _assessmentType.createdAt
      //       delete _assessmentType.updatedAt
      //       _assessmentType.label = label
      //       await axios.post('v1/assessmentTypes', _assessmentType)
      //       props.assessmentTypesMutate && (await props.assessmentTypesMutate())
      //     }

      //     const onChangeText = (text: string) => {
      //       setLabel(text)
      //     }
      //     return (
      //       <>
      //         <Button variant="contained" onClick={onClickOpen}>
      //           Duplicate
      //         </Button>
      //         <DuplicateDialogue
      //           open={open}
      //           handleClose={() => setOpen(false)}
      //           onDuplicate={onClickDuplicate}
      //           onChangeText={onChangeText}
      //           value={label}
      //           unit={'label'}
      //           title={`Are you sure you want to duplicate "${assessmentType.label}"?`}
      //           text={
      //             "This item will be duplicated permanently. You can't undo this action."
      //           }
      //           yesText={'Duplicate'}
      //           noText={'Cancel'}
      //         />
      //       </>
      //     )
      //   },
      // },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
