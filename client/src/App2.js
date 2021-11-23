import React from 'react';

import './App.less';
import { Layout, Menu, Breadcrumb, Grid, Icon, Image } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  DesktopOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import {
  FcComboChart,
  FcCalendar,
  FcConferenceCall,
  FcLeave,
  FcSettings,
  FcCollaboration,
  FcList,
  FcAutomotive,
  FcQuestions,
  FcReadingEbook,
  FcPodiumWithAudience,
  FcExpired,
  FcHome,
  FcSelfie,
  FcBusinessman,
  FcDepartment,
  FcStatistics,
} from 'react-icons/fc';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
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
import LeavePolicy from './components/LeavePolicyForm/LeavePolicyForm';
import Error404 from './components/Error/Error404';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LEAVE_APPROVE, ROLES_ASSIGN } from './constants/permissions';

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const App = () => {
  const { authData } = useSelector((state) => state.auth);

  const renderSubmenu = () => {
    const user = authData.result;
    if (user?.roles?.name == 'staff') {
      return (
        <>
          <Menu.Item key='1' icon={<FcBusinessman />}>
            <Link to='/'>Personal Dashboard</Link>
          </Menu.Item>
          <Menu.Item key='2' icon={<FcLeave />}>
            <Link to='/leaves'>Leave</Link>
          </Menu.Item>
          <SubMenu key='sub1' icon={<FcPodiumWithAudience />} title='Training'>
            <Menu.Item key='3' icon={<FcHome />}>
              <Link to='/training/'>Training Home</Link>
            </Menu.Item>
            <Menu.Item key='4' icon={<FcCollaboration />}>
              <Link to='/training/create'>Organize Workshop</Link>
            </Menu.Item>
            <Menu.Item key='5' icon={<FcLeave />}>
              <Link to='/training/list'>Workshop List</Link>
            </Menu.Item>
            <Menu.Item key='6' icon={<FcList />}>
              <Link to='/training/history'>History</Link>
            </Menu.Item>
            <Menu.Item key='7' icon={<FcAutomotive />}>
              <Link to='/training/submitExt'>Apply External</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key='8' icon={<FcSettings />}>
            Setting
          </Menu.Item>
        </>
      );
    } else if (user?.roles?.name == 'supervisor') {
      return (
        <>
          <SubMenu key='sub1' icon={<FcComboChart />} title='Dashboards'>
            <Menu.Item key='1' icon={<FcBusinessman />}>
              <Link to='/'>Personal</Link>
            </Menu.Item>
            <Menu.Item key='2' icon={<FcDepartment />}>
              <Link to='/supervisor'>Department</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key='3' icon={<FcCalendar />}>
            <Link to='/calendar/'>Calendar</Link>
          </Menu.Item>
          <Menu.Item key='4' icon={<FcLeave />}>
            <Link to='/leaves'>Leave</Link>
          </Menu.Item>
          <SubMenu key='sub2' icon={<FcPodiumWithAudience />} title='Training'>
            <Menu.Item key='5' icon={<FcHome />}>
              <Link to='/training/'>Training Home</Link>
            </Menu.Item>
            <Menu.Item key='6' icon={<FcCollaboration />}>
              <Link to='/training/create'>Organize Workshop</Link>
            </Menu.Item>
            <Menu.Item key='7' icon={<FcLeave />}>
              <Link to='/training/list'>Workshop List</Link>
            </Menu.Item>
            <Menu.Item key='8' icon={<FcList />}>
              <Link to='/training/history'>History</Link>
            </Menu.Item>
            <Menu.Item key='9' icon={<FcAutomotive />}>
              <Link to='/training/submitExt'>Apply External</Link>
            </Menu.Item>
            <Menu.Item key='10' icon={<FcQuestions />}>
              <Link to='/training/extList'>External Requests</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key='sub3' icon={<FcConferenceCall />} title='Employee'>
            <Menu.Item key='11' icon={<FcReadingEbook />}>
              Employee List
            </Menu.Item>
            <Menu.Item key='12' icon={<FcQuestions />}>
              <Link to='/leaves/list'>Leave Request</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key='13' icon={<FcSettings />}>
            Setting
          </Menu.Item>
        </>
      );
    } else if (user?.roles?.name == 'admin') {
      return (
        <>
          <SubMenu key='sub1' icon={<FcComboChart />} title='Dashboards'>
            <Menu.Item key='1' icon={<FcBusinessman />}>
              <Link to='/'>Personal</Link>
            </Menu.Item>
            <Menu.Item key='2' icon={<FcDepartment />}>
              <Link to='/supervisor'>Department</Link>
            </Menu.Item>
            <Menu.Item key='3' icon={<FcStatistics />}>
              <Link to='/admin'>Admin</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key='4' icon={<FcCalendar />}>
            <Link to='/calendar/'>Calendar</Link>
          </Menu.Item>
          <Menu.Item key='5' icon={<FcLeave />}>
            <Link to='/leaves'>Leave</Link>
          </Menu.Item>
          <SubMenu key='sub2' icon={<FcPodiumWithAudience />} title='Training'>
            <Menu.Item key='6' icon={<FcHome />}>
              <Link to='/training/'>Training Home</Link>
            </Menu.Item>
            <Menu.Item key='7' icon={<FcCollaboration />}>
              <Link to='/training/create'>Organize Workshop</Link>
            </Menu.Item>
            <Menu.Item key='8' icon={<FcLeave />}>
              <Link to='/training/list'>Workshop List</Link>
            </Menu.Item>
            <Menu.Item key='9' icon={<FcList />}>
              <Link to='/training/history'>History</Link>
            </Menu.Item>
            <Menu.Item key='10' icon={<FcAutomotive />}>
              <Link to='/training/submitExt'>Apply External</Link>
            </Menu.Item>
            <Menu.Item key='11' icon={<FcQuestions />}>
              <Link to='/training/extList'>External Requests</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key='sub3' icon={<FcConferenceCall />} title='Employee'>
            <Menu.Item key='12' icon={<FcReadingEbook />}>
              Employee List
            </Menu.Item>
            <Menu.Item key='13' icon={<FcQuestions />}>
              <Link to='/leaves/list'>Leave Request</Link>
            </Menu.Item>
            <Menu.Item key='14' icon={<FcExpired />}>
              Policy
            </Menu.Item>
          </SubMenu>
          <Menu.Item key='15' icon={<FcSettings />}>
            Setting
          </Menu.Item>
        </>
      );
    } else {
      return <></>;
    }
  };
  const screens = useBreakpoint();
  //https://github.com/ant-design/ant-design/issues/4926
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh', overflow: 'auto' }}>
        <Header className='site-layout-red'>
          <img className='logo' src='/INTI_Logo_smol.png' />

          <Navbar />
        </Header>
        <Layout>
          {authData && (
            <Sider
              width={200}
              className='site-layout-background'
              breakpoint='lg'
              collapsedWidth='0'
              onBreakpoint={(broken) => {
                console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
            >
              {/**https://stackoverflow.com/questions/56735385/bold-active-menu-after-refreshing-the-page */}
              <Menu
                mode='inline'
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                {renderSubmenu()}
              </Menu>
            </Sider>
          )}
          <Layout style={{ padding: '24px' }}>
            <Content
              className='site-layout-background'
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Switch>
                <PrivateRoute path='/' exact component={Home} />
                <PrivateRoute
                  path='/supervisor'
                  exact
                  component={SupervisorHome}
                />
                <PrivateRoute path='/admin' exact component={AdminHome} />
                <PrivateRoute path='/leaves' exact component={LeaveHome} />
                <PrivateRoute
                  path='/leaves/create'
                  exact
                  component={LeaveForm}
                />
                <PrivateRoute
                  path='/leaves/view/:id'
                  exact
                  component={LeaveDetail}
                />
                <PrivateRoute
                  path='/leaves/edit/:id'
                  exact
                  component={LeaveForm}
                />
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
                <PrivateRoute
                  path='/users/create'
                  exact
                  component={StaffForm}
                />
                <PrivateRoute
                  path='/users/view/:id'
                  exact
                  component={StaffDetail}
                />
                <PrivateRoute
                  path='/leaveTypes'
                  exact
                  component={LeaveTypeHome}
                />
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
                <PrivateRoute
                  path='/roles/edit/:id'
                  exact
                  component={RoleForm}
                />
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
                <Route
                  path='/resetPassword'
                  exact
                  component={ResetPasswordForm}
                />
                <Route path='/leavePolicy' exact component={LeavePolicy} />
                <Route component={Error404} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
