import React from 'react';
import {
  SmileOutlined,
  CrownOutlined,
  TabletOutlined,
  AntDesignOutlined,
  UserOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  UnorderedListOutlined,
  HistoryOutlined,
  FormOutlined,
} from '@ant-design/icons';
import Home from './components/Home/Home';
import LeaveHome from './components/LeaveHome/LeaveHome';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/',
        name: 'Personal Dashboard',
        icon: <UserOutlined />,
        exact: true,
      },
      {
        path: '/leaves',
        name: 'Leaves',
        icon: <ScheduleOutlined />,
        exact: true,
      },
      {
        path: '/training',
        name: 'Training',
        icon: <SolutionOutlined />,
        routes: [
          {
            path: './',
            name: 'Training Home',
            icon: <HomeOutlined />,
            exact: true,
          },
          {
            path: 'list',
            name: 'Workshop List',
            icon: <UnorderedListOutlined />,
          },
          {
            path: 'history',
            name: 'History',
            icon: <HistoryOutlined />,
          },
          {
            path: '/training/submitExt',
            name: 'Apply External',
            icon: <FormOutlined />,
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
};
