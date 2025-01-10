import {
  Assessment,
  Business,
  BusinessCenter,
  Computer,
  FileCopy,
  Folder,
  Handshake,
  ManSharp,
  Monitor,
  MonitorOutlined,
  Newspaper,
  Policy,
  Receipt,
  RunCircle,
  RunCircleRounded,
  Security,
  Settings,
  SystemSecurityUpdate,
  TableChart,
  Woman,
} from '@mui/icons-material'
import { observer, useLocalObservable } from 'mobx-react'

import { WrappingFunction } from '@shopify/react-compose'
import { useRootStore } from 'src/stores'
export type Menu = {
  text: string
  items: Menu[]
  icon: React.ReactNode
  isOpen?: boolean
  isVisible?: boolean
  onClick?: () => void
}

const withMeta: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { routerStore, roleStore } = useRootStore()
    const { isAdmin, isScorer } = roleStore

    const menus: Menu[] = [
      // {
      //   text: 'User Management',
      //   icon: <Woman fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'Users',
      //       icon: <ManSharp fontSize='small' />,
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:users'),
      //       items: []
      //     },
      //   ],
      // },
      // {
      //   text: 'Role Management',
      //   icon: <Security fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'Role',
      //       icon: <Policy fontSize='small' />,
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:roles'),
      //       items: []
      //     },
      //     // {
      //     //   text: 'Permission',
      //     //   icon: <Policy fontSize='small' />,
      //     //   isVisible: true,
      //     //   onClick: () => routerStore.go('admin:policies'),
      //     //   items: []
      //     // },
      //     // {
      //     //   text: 'Permission Group',
      //     //   icon: <Group fontSize='small' />,
      //     //   isVisible: true,
      //     //   onClick: () => routerStore.go('admin:groups'),
      //     //   items: []
      //     // },
      //   ],
      // },
      // {
      //   text: 'System Management',
      //   icon: <Settings fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'Agreements',
      //       icon: <Handshake fontSize='small' />,
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:agreements'),
      //       items: []
      //     },
      //     {
      //       text: 'Templates',
      //       icon: <Newspaper fontSize='small' />,
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:templates'),
      //       items: []
      //     },
      //   ]
      // },
      // {
      //   text: 'A.Cycle Management',
      //   icon: <RunCircleRounded fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'Resources',
      //       icon: <FileCopy fontSize='small' />,
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:files'),
      //       items: []
      //     },
      //     {
      //       text: 'Documents',
      //       icon: <Folder fontSize='small' />,
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:simDocs'),
      //       items: []
      //     },
      //     {
      //       text: 'Simulations',
      //       icon: <Monitor fontSize='small' />,
      //       onClick: () => routerStore.go('admin:simulations'),
      //       isVisible: isAdmin,
      //       items: [],
      //     },
      //     {
      //       text: 'A.Types',
      //       icon: <SystemSecurityUpdate fontSize='small' />,
      //       onClick: () => routerStore.go('admin:assessmentTypes'),
      //       isVisible: isAdmin,
      //       items: [],
      //     },
      //     {
      //       text: 'A.Cycles',
      //       icon: <RunCircle fontSize='small' />,
      //       onClick: () => routerStore.go('admin:assessmentCycles'),
      //       isVisible: isAdmin,
      //       items: [],
      //     },
      //   ]
      // },
      // {
      //   text: 'Client Management',
      //   icon: <Business fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'Clients',
      //       icon: <BusinessCenter fontSize='small' />,
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:clients'),
      //       items: []
      //     },
      //   ]
      // },
      // {
      //   text: 'Finding Management',
      //   icon: <TableChart fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'KeyConcept',
      //       icon: <TableChart fontSize='small' />,
      //       onClick: () => routerStore.go('admin:keyConcepts'),
      //       isVisible: isAdmin,
      //       items: [],
      //     },
      //     {
      //       text: 'Domains',
      //       icon: <TableChart fontSize='small' />,
      //       onClick: () => routerStore.go('admin:domains'),
      //       isVisible: isAdmin,
      //       items: [],
      //     },
      //     {
      //       text: 'Findings',
      //       icon: <TableChart fontSize='small' />,
      //       onClick: () => routerStore.go('admin:findings'),
      //       isVisible: isAdmin,
      //       items: [],
      //     },
      //   ],
      // },
      // {
      //   text: 'Submisstion Management(Under construction)',
      //   icon: <Receipt />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [],
      // },
      // {
      //   text: 'A.Cycle User Management',
      //   icon: <MonitorOutlined fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'Screen Log',
      //       icon: (
      //         <Computer />
      //       ),
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:userSimulations'),
      //       items: []
      //     },
      //   ],
      // },
      // {
      //   text: 'Scoring Management',
      //   icon: <Assessment fontSize='small' />,
      //   onClick: () => null,
      //   isVisible: isAdmin,
      //   items: [
      //     {
      //       text: 'Scorings Pages',
      //       icon: (
      //         <Assessment fontSize='small' color='primary' />
      //       ),
      //       isVisible: isAdmin,
      //       onClick: () => routerStore.go('admin:assessments'),
      //       items: []
      //     },
      //   ],
      // },
      // {
      //   text: 'Scoring',
      //   icon: <Assessment fontSize='small' />,
      //   onClick: () => routerStore.go('scorer:scoring'),
      //   isVisible: isAdmin || isScorer,
      //   items: [],
      // },
    ]

    const state = useLocalObservable(() => ({
      menus: menus,
    }))

    return <WrappedComponent {...props} state={state} />
  })

export default withMeta
