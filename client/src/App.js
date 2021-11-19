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
} from 'antd';
import { LikeOutlined, UserOutlined } from '@ant-design/icons';
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

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
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
import { useLocation, useHistory } from 'react-router';
import { LOGOUT } from './constants/actionTypes';
import jwtDecode from 'jwt-decode';
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
  const { authData } = useSelector((state) => state.auth);
  const user = authData?.result;
  const location = useLocation();
  var temp = defaultProps;
  const history = useHistory();
  const logout = () => {
    dispatch({ type: LOGOUT });
    history.push('/auth');
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
        menuFooterRender={(props) => {
          {
            /** 
            <a
              style={{
                lineHeight: '48rpx',
                display: 'flex',
                height: 48,
                color: 'rgba(255, 255, 255, 0.65)',
                alignItems: 'center',
              }}
              href='https://preview.pro.ant.design/dashboard/analysis'
              target='_blank'
              rel='noreferrer'
            >
              <img
                alt='pro-logo'
                src='https://procomponents.ant.design/favicon.ico'
                style={{
                  width: 16,
                  height: 16,
                  margin: '0 16px',
                  marginRight: 10,
                }}
              />
              {!(props === null || props === void 0
                ? void 0
                : props.collapsed) && 'Preview Pro'}
            </a>*/
          }
          return (
            <Image className='logo' src='/INTI_Logo.png' preview={false} />
          );
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
          <Switch>
            <PrivateRoute path='/' exact component={Home} />
            <PrivateRoute path='/supervisor' exact component={SupervisorHome} />
            <PrivateRoute path='/admin' exact component={AdminHome} />
            <PrivateRoute path='/leaves' exact component={LeaveHome} />
            <PrivateRoute path='/leaves/create' exact component={LeaveForm} />
            <PrivateRoute
              path='/leaves/view/:id'
              exact
              component={LeaveDetail}
            />
            <PrivateRoute path='/leaves/edit/:id' exact component={LeaveForm} />
            <PrivateRoute path='/leaves/list' exact component={LeaveList} />
            <PrivateRoute
              path='/leaves/history'
              exact
              component={LeaveHistory}
            />

            <PrivateRoute path='/depts' exact component={DeptHome} />
            <PrivateRoute path='/depts/create' exact component={DeptForm} />
            <PrivateRoute path='/users' exact component={StaffHome} />
            <PrivateRoute path='/profile' exact component={Profile} />
            <PrivateRoute path='/users/create' exact component={StaffForm} />
            <PrivateRoute
              path='/users/view/:id'
              exact
              component={StaffDetail}
            />
            <PrivateRoute path='/leaveTypes' exact component={LeaveTypeHome} />
            <PrivateRoute path='/test' exact component={Test} />
            <PrivateRoute path='/test2' exact component={Test2} />
            <PrivateRoute
              path='/leaveTypes/create'
              exact
              component={LeaveTypeForm}
            />
            <PrivateRoute
              path='/leaveTypes/edit/:id'
              exact
              component={LeaveTypeForm}
            />
            <PrivateRoute path='/roles' exact component={RoleHome} />
            <PrivateRoute path='/roles/create' exact component={RoleForm} />
            <PrivateRoute path='/roles/edit/:id' exact component={RoleForm} />
            <PrivateRoute path='/calendar' exact component={Calendar} />

            <PrivateRoute path='/holidays' exact component={HolidayHome} />
            <PrivateRoute
              path='/holidays/create/:id'
              exact
              component={HolidayForm}
            />

            <PrivateRoute path='/training' exact component={TrainingHome} />
            <PrivateRoute
              path='/training/create'
              exact
              component={TrainingForm}
            />
            <PrivateRoute
              path='/training/list'
              exact
              component={TrainingList}
            />
            <PrivateRoute
              path='/training/view/:id'
              exact
              component={TrainingDetails}
            />
            <PrivateRoute
              path='/training/submitExt'
              exact
              component={ExtTrainingForm}
            />
            <PrivateRoute
              path='/training/extList'
              exact
              component={ExtTrainingList}
            />
            <PrivateRoute
              path='/training/history'
              exact
              component={TrainingHistory}
            />

            <PublicRoute path='/auth' exact component={Auth} />
            <Route path='/resetPassword' exact component={ResetPasswordForm} />

            <PrivateRoute path='/policy' exact component={LeavePolicyHome} />
            <PrivateRoute
              path='/policy/create'
              exact
              component={LeavePolicyForm}
            />
            <PrivateRoute
              path='/policy/edit/:id'
              exact
              component={LeavePolicyForm}
            />
            <Route component={Error404} />
          </Switch>
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
