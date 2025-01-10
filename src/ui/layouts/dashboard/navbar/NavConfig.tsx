import {
  Assessment,
  Business,
  Computer,
  DataArray,
  DataObject,
  Folder,
  Handshake,
  MonitorOutlined,
  RunCircleRounded,
  Score,
  ScoreOutlined,
  Scoreboard,
  Security,
  TableChart,
} from '@mui/icons-material'
import { PATH_ADMIN, PATH_PAGE } from 'src/routes/paths'

import SvgIconStyle from '../../../components/SvgIconStyle'
import { getCookie } from 'cookies-next'
import { useRootStore } from 'src/stores'

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
)

const ICONS = {
  user: getIcon('ic_user'),
}

const navConfig =
  getCookie('role') !== 'SimScorer'
    ? [
        // MANAGEMENT
        // ----------------------------------------------------------------------
        {
          subheader: 'Security management',
          items: [
            // USER
            {
              title: 'Security',
              path: PATH_ADMIN.security.root,
              icon: <Security fontSize="small" />,
              children: [
                {
                  title: 'Sign-in Security Review',
                  path: PATH_ADMIN.security.signinReview,
                  icon: null,
                },
              ],
            },
          ],
        },
        {
          subheader: 'Data management',
          items: [
            // Data
            {
              title: 'Data',
              path: PATH_ADMIN.data.root,
              icon: <Folder fontSize="small" />,
              children: [
                // { title: 'PPT Report', path: PATH_PAGE.comingSoon, icon: null },
                {
                  title: 'Datadump',
                  path: PATH_ADMIN.data.dataDump,
                  icon: null,
                },
                // {
                //   title: 'Datadump - Monitoring Notes',
                //   path: PATH_PAGE.comingSoon,
                //   icon: null,
                // },
                {
                  title: 'BU-TR Status',
                  path: PATH_ADMIN.data.butrStatus,
                  icon: null,
                },
                // { title: 'Status Report', path: PATH_PAGE.comingSoon, icon: null },
                // {
                //   title: 'Domain Performace',
                //   path: PATH_PAGE.comingSoon,
                //   icon: null,
                // },
                {
                  title: 'Dashboard',
                  path: PATH_ADMIN.data.dashboard,
                  icon: null,
                },
                // { title: 'Roadmap', path: PATH_PAGE.comingSoon, icon: null },
              ],
            },
          ],
        },
        {
          subheader: 'user management',
          items: [
            // USER
            {
              title: 'users',
              path: PATH_ADMIN.users.root,
              icon: ICONS.user,
              children: [
                { title: 'Roles', path: PATH_ADMIN.users.roles, icon: null },
                {
                  title: 'Clients',
                  path: PATH_ADMIN.users.clients,
                  icon: null,
                },
                {
                  title: 'User Management',
                  path: PATH_ADMIN.users.userManagement,
                  icon: null,
                },
                {
                  title: 'Sim Management',
                  path: PATH_ADMIN.users.simManagement,
                  icon: null,
                },
                {
                  title: 'User Status Management',
                  path: PATH_ADMIN.users.userStatusManagement,
                  icon: null,
                },
                {
                  title: 'Invoice Management',
                  path: PATH_ADMIN.users.invoice,
                  icon: null,
                },

                {
                  title: 'User Permissions',
                  path: PATH_ADMIN.users.permissions,
                  icon: null,
                },
                {
                  title: 'Logs Export',
                  path: PATH_ADMIN.users.logs,
                  icon: null,
                },
              ],
            },
          ],
        },
        {
          subheader: 'Scoring management',
          items: [
            {
              title: 'Scoring',
              path: PATH_ADMIN.scorings.root,
              icon: <ScoreOutlined fontSize="small" />,
              children: [
                {
                  title: 'Manage',
                  path: PATH_ADMIN.scorings.manage,
                  icon: null,
                },
                { title: 'Score', path: PATH_ADMIN.scorings.score, icon: null },
                {
                  title: 'Adjudicate',
                  path: PATH_ADMIN.scorings.adjudicate,
                  icon: null,
                },
                {
                  title: 'Review',
                  path: PATH_ADMIN.scorings.review,
                  icon: null,
                },
                {
                  title: 'Performance',
                  path: PATH_ADMIN.scorings.performance,
                  icon: null,
                },
                {
                  title: 'SimDistribution',
                  path: PATH_ADMIN.scorings.simDistributions,
                  icon: null,
                },
              ],
            },
          ],
        },
        {
          subheader: 'Assessment Cycles management',
          items: [
            {
              title: 'Assessment Cycles',
              icon: <RunCircleRounded fontSize="small" />,
              path: PATH_ADMIN.assessmentCycles.root,
              children: [
                {
                  title: 'PDF files',
                  path: PATH_ADMIN.assessmentCycles.files,
                },
                {
                  title: 'Simulations',
                  path: PATH_ADMIN.assessmentCycles.simulations,
                },
                {
                  title: 'Resources',
                  path: PATH_ADMIN.assessmentCycles.resources,
                },
                {
                  title: 'Assessment Types',
                  path: PATH_ADMIN.assessmentCycles.assessmentTypes,
                },
                {
                  title: 'Assessment Cycles',
                  path: PATH_ADMIN.assessmentCycles.assessmentCycles,
                },
                {
                  title: 'Change Log Audit',                  
                  path: PATH_ADMIN.assessmentCycles.changeLogAudit,
                },
              ],
            },
          ],
        },
        {
          subheader: 'finding management',
          items: [
            {
              title: 'findings',
              icon: <TableChart fontSize="small" />,
              path: PATH_ADMIN.findings.root,
              children: [
                {
                  title: 'list',
                  path: PATH_ADMIN.findings.list,
                  icon: null,
                },
                {
                  title: 'keyConcepts',
                  path: PATH_ADMIN.findings.keyConcepts,
                  icon: null,
                },
                {
                  title: 'domain',
                  path: PATH_ADMIN.findings.domain,
                  icon: null,
                },
              ],
            },
          ],
        },
        {
          subheader: 'System management',
          items: [
            {
              title: 'System',
              icon: <Handshake fontSize="small" />,
              path: PATH_ADMIN.system.root,
              children: [
                {
                  title: 'Privacy & Policy',
                  path: PATH_ADMIN.system.privacyPolicy,
                  icon: null,
                },
                {
                  title: 'Email Template',
                  path: PATH_ADMIN.system.emailTemplate,
                },
                { title: 'Migration', path: PATH_ADMIN.system.migration },
                {
                  title: 'Settings',
                  path: PATH_ADMIN.system.settings,
                },
              ],
            },
          ],
        },
        // {
        //   subheader: 'baseline management',
        //   items: [
        //     {
        //       title: 'screenLogs',
        //       icon: <MonitorOutlined fontSize='small' />,
        //       path: PATH_ADMIN.userSimulations.root,
        //       children: [
        //         {
        //           title: 'baselines',
        //           path: PATH_ADMIN.userSimulations.root,
        //           icon: null
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   subheader: 'scoring management',
        //   items: [
        //     {
        //       title: 'baseline',
        //       icon: <Computer />,
        //       path: PATH_SCORER.scorings.root,
        //       children: [
        //         {
        //           title: 'scorings',
        //           path: PATH_SCORER.scorings.root,
        //           icon: null
        //         },
        //       ],
        //     },
        //     {
        //       title: 'assessment',
        //       icon: <Assessment fontSize='small' />,
        //       path: PATH_ADMIN.assessments.root,
        //       children: [
        //         {
        //           title: 'scoring',
        //           path: PATH_ADMIN.assessments.root,
        //           icon: null
        //         },
        //         {
        //           title: 'adjudication',
        //           path: PATH_ADMIN.adjudication.root,
        //           icon: null
        //         },
        //       ],
        //     },
        //   ],
        // },
      ]
    : [
        {
          subheader: 'Scoring management',
          items: [
            {
              title: 'Scoring',
              path: PATH_ADMIN.scorings.root,
              icon: <ScoreOutlined fontSize="small" />,
              children: [
                { title: 'Score', path: PATH_ADMIN.scorings.score, icon: null },
              ],
            },
          ],
        },
      ]

export default navConfig
