import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { LOGOUT } from '../../constants/actionTypes';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = ({ user }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const logout = () => {
    dispatch({ type: LOGOUT });

    history.push('/auth');
  };
  const login = () => {
    history.push('/auth');
  };

  const menu = true;
  const currentUser = {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    name: 'Cheah',
  };
  const menuHeaderDropdown = (
    <Menu className={styles.menu}>
      <Menu.Item key='profile'>
        <Link to='/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item key='logout' onClick={logout}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );
  return user ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size='small'
          className={styles.avatar}
          src='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
          alt='avatar'
        />
        <span
          className={`${styles.name} anticon`}
        >{`${user.first_name} ${user.last_name}`}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <Link to='/auth'>Login</Link>
  );
};

export default AvatarDropdown;
