import React, { useState, useEffect } from 'react';
import {
  message,
  Avatar,
  Button,
  Menu,
  Space,
  Typography,
  Dropdown,
  Badge,
  Tabs,
  List,
  Row,
  Col,
  Image,
} from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import jwtDecode from 'jwt-decode';
import 'antd/dist/antd.css';
import './Navbar.less';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../constants/actionTypes';
const { TabPane } = Tabs;
const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    dispatch({ type: LOGOUT });

    navigate('/auth');
    setUser(null);
  };
  const login = () => {
    navigate('/auth');
  };
  const menu = (
    <Menu>
      <Menu.Item key='profile'>
        <Link to='/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item key='logout' onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        message.error('Session expired. Please login again');
        logout();
      }
    }
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  //https://stackoverflow.com/questions/50882990/how-to-right-align-menu-items-in-ant-design
  return (
    <>
      <Menu
        theme='light'
        mode='horizontal'
        forceSubMenuRender={true}
        style={{ background: 'red' }}
        className='right'
      >
        {/**<NoticeIcon />*/}
        {user ? (
          <>
            <Menu.SubMenu
              key='SubMenu'
              icon={<UserOutlined />}
              title={`${user.result.first_name} ${user.result.last_name}`}
            >
              <Menu.Item key='profile'>
                <Link to='/profile'>Profile</Link>
              </Menu.Item>
              <Menu.Item key='logout' onClick={logout}>
                Logout
              </Menu.Item>
            </Menu.SubMenu>
          </>
        ) : (
          <>
            <Menu.Item key='login' onClick={login}>
              SignIn
            </Menu.Item>
          </>
        )}
      </Menu>
    </>
  );
};

export default Navbar;
/**
 *   <Row justify='space-between'>
        <Col>
          <Menu theme='light' mode='horizontal'>
            <Menu.Item key='Home'>
              <Link to='/'>Home</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col>
          <Menu theme='light' mode='horizontal'>
            {user ? (
              <>
                <Menu.Item key='notification'>
                  <BellOutlined />
                </Menu.Item>
                <NoticeIcon />
                <Menu.SubMenu
                  key='SubMenu'
                  icon={<UserOutlined />}
                  title={`${user.result.first_name} ${user.result.last_name}`}
                >
                  <Menu.Item key='profile'>
                    <Link to='/profile'>Profile</Link>
                  </Menu.Item>
                  <Menu.Item key='logout' onClick={logout}>
                    Logout
                  </Menu.Item>
                </Menu.SubMenu>
              </>
            ) : (
              <>
                <Menu.Item
                  key='login'
                  onClick={login}
                  style={{ marginLeft: 'auto' }}
                >
                  SignIn
                </Menu.Item>
              </>
            )}
          </Menu>
        </Col>
      </Row>
 */
