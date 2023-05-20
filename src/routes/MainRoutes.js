import { lazy } from 'react'

// project import
import Loadable from 'components/Loadable'
import MainLayout from 'layout/MainLayout'
import AuthLogin from 'pages/authentication/auth-forms/AuthLogin'

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')))
const Category = Loadable(lazy(() => import('pages/category/Home')))
const User = Loadable(lazy(() => import('pages/user/Home')))
const Report = Loadable(lazy(() => import('pages/report/Home')))
const Chat = Loadable(lazy(() => import('pages/chat/Home')))

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')))

// render - utilities
const Typography = Loadable(
  lazy(() => import('pages/components-overview/Typography')),
)
const Color = Loadable(lazy(() => import('pages/components-overview/Color')))
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')))
const AntIcons = Loadable(
  lazy(() => import('pages/components-overview/AntIcons')),
)

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Category />,
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />,
    },
    // {
    //   path: 'color',
    //   element: <Color />,
    // },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />,
    //     },
    //   ],
    // },
    {
      path: 'category',
      children: [
        {
          path: 'default',
          element: <Category />,
        },
      ],
    },
    {
      path: 'user',
      children: [
        {
          path: 'default',
          element: <User />,
        },
      ],
    },
    {
      path: 'report',
      children: [
        {
          path: 'default',
          element: <Report />,
        },
      ],
    },
    // {
    //   path: 'chat',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <Chat />,
    //     },
    //   ],
    // },
    // {
    //   path: 'sample-page',
    //   element: <SamplePage />,
    // },
    // {
    //   path: 'shadow',
    //   element: <Shadow />,
    // },
    // {
    //   path: 'typography',
    //   element: <Typography />,
    // },
    // {
    //   path: 'icons/ant',
    //   element: <AntIcons />,
    // },
  ],
}

export default MainRoutes
