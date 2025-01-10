import { AdminLayout, AuthLayout } from '@layouts'
import { Banner, Container } from 'src/ui/core/components'
import { useEffect, useMemo } from 'react'

import Agreements from 'src/ui/pages/admin/Agreements/Agreements'
import Assessment from 'src/ui/pages/admin/Scorings/Assessment/Assessment'
import AssessmentCycles from '@components/tables/AssessmentCycles/AssessmentCycles'
import AssessmentTypes from 'src/ui/pages/admin/AssessmentTypes/AssessmentTypes'
import Clients from 'src/ui/pages/admin/Clients/Clients'
import DashboardLayout from 'src/ui/layouts/dashboard'
import Domains from 'src/ui/pages/admin/Domains/Domains'
import Files from 'src/ui/pages/admin/Files/Files'
import Findings from 'src/ui/pages/admin/Findings/Findings'
import Folders from 'src/ui/pages/admin/Folders/Folders'
import KeyConcepts from 'src/ui/pages/admin/KeyConcepts/KeyConcepts'
import Policies from 'src/ui/pages/admin/Policies/Policies'
import Roles from 'src/ui/pages/admin/Roles/Roles'
import { RouteProps } from 'react-router-dom'
import Scoring from 'src/ui/pages/admin/Scorings/Scorings'
import ScoringManagement from 'src/ui/pages/admin/ScoringManagement/ScoringManagement'
import Signin from 'src/ui/pages/auth/Signin/Signin'
import SimDocs from 'src/ui/pages/admin/SimDocs/SimDocs'
import Simulations from 'src/ui/pages/admin/Simulations/Simulations'
import Templates from 'src/ui/pages/admin/Templates/Templates'
import UserSimulations from 'src/ui/pages/admin/SimManagement/SimManagement'
import Users from 'src/ui/pages/admin/Users/Users'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

export type NestedRoute = RouteProps & {
  routeName: string
  routes?: NestedRoute[]
}

const withMeta = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const { routerStore } = useRootStore()
    const routes = [
      {
        path: '/',
        element: <AdminLayout />,
        children: [],
      },
      {
        path: '/admin',
        element: <DashboardLayout />,
        children: [
          {
            prefix: 'admin/',
            name: 'admin:roles',
            path: 'roles',
            element: <Roles />,
          },
          {
            prefix: 'admin/',
            name: 'admin:agreements',
            path: 'agreements',
            element: <Agreements />,
          },
          {
            prefix: 'admin/',
            name: 'admin:templates',
            path: 'templates',
            element: <Templates />,
          },
          {
            prefix: 'admin/',
            name: 'admin:files',
            path: 'files',
            element: <Files />,
          },
          {
            prefix: 'admin/',
            name: 'admin:clients',
            path: 'clients',
            element: <Clients />,
          },
          {
            prefix: 'admin/',
            name: 'admin:users',
            path: 'users',
            element: <Users />,
          },
          {
            prefix: 'admin/',
            name: 'admin:simulations',
            path: 'simulations',
            element: <Simulations />,
          },
          {
            prefix: 'admin/',
            name: 'admin:assessmentCycles',
            path: 'assessmentCycles',
            element: <AssessmentCycles />,
          },
          {
            prefix: 'admin/',
            name: 'admin:assessments',
            path: 'assessments',
            element: <ScoringManagement />,
          },
          {
            prefix: 'admin/',
            name: 'admin:assessmentTypes',
            path: 'assessmentTypes',
            element: <AssessmentTypes />,
          },
          {
            prefix: 'admin/',
            name: 'admin:folders',
            path: 'folders',
            element: <Folders />,
          },
          {
            prefix: 'admin/',
            name: 'admin:simDocs',
            path: 'simDocs',
            element: <SimDocs />,
          },
          {
            prefix: 'admin/',
            name: 'admin:userSimulations',
            path: 'userSimulations',
            element: <UserSimulations />,
          },
          {
            prefix: 'admin/',
            name: 'admin:findings',
            path: 'findings',
            element: <Findings />,
          },
          {
            prefix: 'admin/',
            name: 'admin:keyConcepts',
            path: 'keyConcepts',
            element: <KeyConcepts />,
          },
          {
            prefix: 'admin/',
            name: 'admin:domains',
            path: 'domains',
            element: <Domains />,
          },
          {
            prefix: 'admin/',
            name: 'admin:policies',
            path: 'policies',
            element: <Policies />,
          },
          {
            prefix: 'admin/',
            name: 'admin:assessment',
            path: 'assessment',
            element: <Assessment />,
          },
        ],
      },
      {
        path: '/auth',
        element: <AuthLayout LeftComponent={<Banner h2="CRAA" h4="ADMIN" />} />,
        children: [
          {
            prefix: 'auth/',
            name: 'auth:signin',
            path: 'signin',
            element: (
              <Container sx={{ mt: 20 }}>
                <Signin />
              </Container>
            ),
          },
        ],
      },
      {
        path: '/scorer',
        element: <AdminLayout />,
        children: [
          {
            prefix: 'scorer/',
            name: 'scorer:scoring',
            path: 'scoring',
            element: <Scoring />,
          },
        ],
      },
    ]

    const adminRoutes = useMemo(() => routes, [])

    const routePaths = {}
    _.filter(adminRoutes, (route) => route.children.length > 0)
      .map((route) => route.children)
      .flatMap((children) => children)
      .forEach((route) => {
        const _route = { [route.name]: route.prefix + route.path }
        _.assign(routePaths, _route)
      })

    // useEffect(() => routerStore.setRoutePaths(routePaths), [])

    const meta = {
      adminRoutes,
      routePaths,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withMeta
