import React, { useEffect, useState } from 'react';

import './Profile.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  Descriptions,
  Badge,
  Button,
  Divider,
  Typography,
  Space,
  Upload,
  Image,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { getUser } from '../../actions/users';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
//https://github.com/nanxiaobei/antd-img-crop#styles
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Text } = Typography;

const Profile = ({ user }) => {
  const screens = useBreakpoint();
  return (
    <>
      <Divider>
        <Text style={{ fontSize: 23 }}>Profile Page</Text>
      </Divider>
      <center>
        <div></div>
      </center>

      <Descriptions
        title='Profile Details'
        bordered
        layout={screens.md ? 'horizontal' : 'vertical'}
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label='Emoployee ID'>
          {user.emp_id}
        </Descriptions.Item>
        <Descriptions.Item label='First Name'>
          {user.first_name}
        </Descriptions.Item>
        <Descriptions.Item label='Last Name'>
          {user.last_name}
        </Descriptions.Item>
        <Descriptions.Item label='Department'>
          {user.department.name}
        </Descriptions.Item>
        <Descriptions.Item label='Employment Date'>
          {moment(user.employment_date).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label='Roles'>{user.roles.name}</Descriptions.Item>
      </Descriptions>
      <Descriptions title='Leave Balance' bordered>
        {user.leaveCount.map((leave) => (
          <Descriptions.Item
            key={leave.leaveType._id}
            label={leave.leaveType.name}
          >
            {leave.count}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Space>
        <Button>
          <Link to='/'>Back to Home</Link>
        </Button>
        <Button>
          <Link to='/profile/changePassword'>Change Password</Link>
        </Button>
      </Space>
    </>
  );
};
//https://flexiple.com/loop-through-object-javascript/

export default Profile;
