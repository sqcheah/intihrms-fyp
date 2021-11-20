import React, { useEffect, useState } from 'react';
import {
  Button,
  Descriptions,
  Result,
  Space,
  Statistic,
  Layout,
  Image,
  message,
  notification,
} from 'antd';
import {
  CheckCircleOutlined,
  LikeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import RightContent from './components/GlobalHeader/RightContent';
import ProLayout, {
  PageContainer,
  SettingDrawer,
} from '@ant-design/pro-layout';
import defaultProps from './_defaultProps';
import supervisorProps from './_supervisorProps';
import adminProps from './_adminProps';
import NoticeIcon from './components/backup/NoticeIcon/';
import Avatar from './components/GlobalHeader/AvatarDropdown';
import './App.less';

import LeaveHome from './components/LeaveHome/LeaveHome';
import Navbar from './components/Navbar/Navbar';
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import LeaveForm from './components/LeaveForm/LeaveForm';
import LeaveDetail from './components/LeaveDetail/LeaveDetail';
import LeaveList from './components/LeaveList/LeaveList';
import LeaveHistory from './components/LeaveHistory/LeaveHistory';
import StaffForm from './components/StaffForm/StaffForm';
import DeptHome from './components/DeptHome/DeptHome';
import DeptForm from './components/DeptForm/DeptForm';
import StaffHome from './components/StaffHome/StaffHome';
import StaffDetail from './components/StaffDetails/StaffDetail';
import LeaveTypeForm from './components/LeaveTypeForm/LeaveTypeForm';
import LeaveTypeHome from './components/LeaveTypeHome/LeaveTypeHome';
import RoleHome from './components/RoleHome/RoleHome';
import RoleForm from './components/RoleForm/RoleForm';
import Profile from './components/Profile/Profile';
import Calendar from './components/Calendar/Calendar';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Test from './components/Test/Test';
import ResetPasswordForm from './components/ResetPasswordForm/ResetPasswordForm';
import HolidayHome from './components/HolidayHome/HolidayHome';
import HolidayForm from './components/HolidayForm/HolidayForm';
import Test2 from './components/Test2/Test2';
import TrainingHome from './components/TrainingHome/TrainingHome';
import TrainingForm from './components/TrainingForm/TrainingForm';
import TrainingList from './components/TrainingList/TrainingList';
import TrainingDetails from './components/TrainingDetails/TrainingDetails';
import ExtTrainingForm from './components/ExtTrainingForm/ExtTrainingForm';
import ExtTrainingList from './components/ExtTrainingList/ExtTrainingList';
import TrainingHistory from './components/TrainingHistory/TrainingHistory';
import AdminHome from './components/AdminHome/AdminHome';
import SupervisorHome from './components/SupervisorHome/SupervisorHome';
import LeavePolicyForm from './components/LeavePolicyForm/LeavePolicyForm';
import LeavePolicyHome from './components/LeavePolicyHome/LeavePolicyHome';
import Error404 from './components/Error/Error404';

import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { LOGOUT } from './constants/actionTypes';
import jwtDecode from 'jwt-decode';

import { io } from 'socket.io-client';

const { Header, Footer, Sider, Content } = Layout;
const App = () => {
  const dispatch = useDispatch();
  const [settings, setSetting] = useState({
    fixSiderbar: true,
    navTheme: 'light',
    primaryColor: '#1890ff',
    layout: 'side',
    contentWidth: 'Fluid',
    splitMenus: false,
  });
  const [pathname, setPathname] = useState('/');
  const [socket, setSocket] = useState(null);
  const { authData } = useSelector((state) => state.auth);
  const user = authData?.result;
  const location = useLocation();
  var temp = defaultProps;
  const navigate = useNavigate();
  const logout = () => {
    dispatch({ type: LOGOUT });
    navigate('/auth');
  };
  useEffect(() => {
    setPathname(location.pathname);
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        message.error('Session expired. Please login again');
        logout();
      }
    }
  }, [location]);

  useEffect(() => {
    setSocket(io('http://localhost:5000'));
  }, []);
  useEffect(() => {
    if (socket && user) {
      socket?.emit('newUser', user);
      socket.emit('listUser');

      socket.on('getNotif', (data) => {
        notification.open({
          message: 'title',
          description: 'body',
          icon: <CheckCircleOutlined />,
          placement: 'bottomRight',
        });
      });
    }
  }, [socket, user]);

  if (user?.roles?.name == 'supervisor') temp = supervisorProps;
  else if (user?.roles?.name == 'admin') temp = adminProps;
  else temp = defaultProps;
  return (
    <div
      id='test-pro-layout'
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        title={false}
        logo={() => (
          <Image className='logo' src='/INTI_Logo.png' preview={false} />
        )}
        {...temp}
        location={{
          pathname,
        }}
        menuRender={(props, defaultDom) => {
          return user ? defaultDom : false;
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => {
          let path = item.path.split('/./')[0];
          return <Link to={path || '/'}>{dom}</Link>;
        }}
        rightContentRender={() => (
          <Space size='large'>
            <NoticeIcon user={user} />
            <Avatar user={user} />
          </Space>
        )}
        {...settings}
      >
        <Content className='site-layout-background'>
          <Routes>
            <Route
              path='/'
              element={
                <PrivateRoute>
                  <Home socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/supervisor'
              element={
                <PrivateRoute>
                  <SupervisorHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/admin'
              element={
                <PrivateRoute>
                  <AdminHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaves'
              element={
                <PrivateRoute>
                  <LeaveHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaves/create'
              element={
                <PrivateRoute>
                  <LeaveForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaves/view/:id'
              element={
                <PrivateRoute>
                  <LeaveDetail socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaves/edit/:id'
              element={
                <PrivateRoute>
                  <LeaveForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaves/list'
              element={
                <PrivateRoute>
                  <LeaveList socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaves/history'
              element={
                <PrivateRoute>
                  <LeaveHistory socket={socket} user={user} />
                </PrivateRoute>
              }
            />

            <Route
              path='/depts'
              element={
                <PrivateRoute>
                  <DeptHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/depts/create'
              element={
                <PrivateRoute>
                  <DeptForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/users'
              element={
                <PrivateRoute>
                  <StaffHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/users/create'
              element={
                <PrivateRoute>
                  <StaffForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/users/view/:id'
              element={
                <PrivateRoute>
                  <StaffDetail socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaveTypes'
              element={
                <PrivateRoute>
                  <LeaveTypeHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/test'
              element={
                <PrivateRoute>
                  <Test socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/test2'
              element={
                <PrivateRoute>
                  <Test2 socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaveTypes/create'
              element={
                <PrivateRoute>
                  <LeaveTypeForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/leaveTypes/edit/:id'
              element={
                <PrivateRoute>
                  <LeaveTypeForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/roles'
              element={
                <PrivateRoute>
                  <RoleHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/roles/create'
              element={
                <PrivateRoute>
                  <RoleForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/roles/edit/:id'
              element={
                <PrivateRoute>
                  <RoleForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/calendar'
              element={
                <PrivateRoute>
                  <Calendar socket={socket} user={user} />
                </PrivateRoute>
              }
            />

            <Route
              path='/holidays'
              element={
                <PrivateRoute>
                  <HolidayHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/holidays/create/:id'
              element={
                <PrivateRoute>
                  <HolidayForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />

            <Route
              path='/training/*'
              element={
                <PrivateRoute>
                  <TrainingHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/training/create'
              element={
                <PrivateRoute>
                  <TrainingForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/training/list'
              element={
                <PrivateRoute>
                  <TrainingList socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/training/view/:id'
              element={
                <PrivateRoute>
                  <TrainingDetails socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/training/submitExt'
              element={
                <PrivateRoute>
                  <ExtTrainingForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/training/extList'
              element={
                <PrivateRoute>
                  <ExtTrainingList socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/training/history'
              element={
                <PrivateRoute>
                  <TrainingHistory socket={socket} user={user} />
                </PrivateRoute>
              }
            />

            <Route
              path='/policy'
              element={
                <PrivateRoute>
                  <LeavePolicyHome socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/policy/create'
              element={
                <PrivateRoute>
                  <LeavePolicyForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path='/policy/edit/:id'
              element={
                <PrivateRoute>
                  <LeavePolicyForm socket={socket} user={user} />
                </PrivateRoute>
              }
            />

            <Route
              path='/auth'
              element={
                <PublicRoute>
                  <Auth socket={socket} user={user} />
                </PublicRoute>
              }
            />
            <Route
              path='/resetPassword'
              element={<ResetPasswordForm socket={socket} user={user} />}
            />
            <Route element={<Error404 />} />
          </Routes>
        </Content>
        {/**   <div
            style={{
              height: '120vh',
            }}
          >
            <Result
              status='404'
              style={{
                height: '100%',
                background: '#fff',
              }}
              title='Hello World'
              subTitle='Sorry, you are not authorized to access this page.'
              extra={<Button type='primary'>Back Home</Button>}
            />
          </div>*/}
      </ProLayout>
      {/**
      <SettingDrawer
        pathname={pathname}
        getContainer={() => document.getElementById('test-pro-layout')}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting);
        }}
        disableUrlParams
      />
       */}
    </div>
  );
};
export default App;

/**
 * 
 *    content={content}
            tabList={[
              {
                tab: '基本信息',
                key: 'base',
              },
              {
                tab: '详细信息',
                key: 'info',
              },
            ]}
            extraContent={
              <Space size={24}>
                <Statistic
                  title='Feedback'
                  value={1128}
                  prefix={<LikeOutlined />}
                />
                <Statistic title='Unmerged' value={93} suffix='/ 100' />
              </Space>
            }
            extra={[
              <Button key='3'>操作</Button>,
              <Button key='2'>操作</Button>,
              <Button key='1' type='primary'>
                主操作
              </Button>,
            ]}
            footer={[
              <Button key='3'>重置</Button>,
              <Button key='2' type='primary'>
                提交
              </Button>,
            ]}
 */
