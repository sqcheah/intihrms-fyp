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
  BarChartOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Home from './components/Home/Home';
import LeaveHome from './components/LeaveHome/LeaveHome';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/',
        name: 'Dashboard',
        icon: <BarChartOutlined />,
        routes: [
          {
            path: '/',
            name: 'Personal',
            icon: <UserOutlined />,
            exact: true,
          },
          {
            path: '/supervisor',
            name: 'Department',
            icon: <ApartmentOutlined />,
            exact: true,
          },
        ],
      },
      {
        path: '/calendar',
        name: 'Calendar',
        icon: <CalendarOutlined />,
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
            path: 'create',
            name: 'Organize Workshop',
            icon: <UsergroupAddOutlined />,
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
            path: 'submitExt',
            name: 'Apply External',
            icon: <FormOutlined />,
          },
          {
            path: 'extList',
            name: 'External Requests',
            icon: <ExclamationCircleOutlined />,
          },
        ],
      },
      {
        path: '',
        name: 'Employee',
        icon: <BarChartOutlined />,
        routes: [
          {
            path: '/leaves/list',
            name: 'Leave Request',
            icon: <ExclamationCircleOutlined />,
            exact: true,
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
};
