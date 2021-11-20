import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import './StaffDetail.css';
import { useDispatch, useSelector } from 'react-redux';

import { Descriptions, Badge, Button } from 'antd';
import { getUser } from '../../actions/users';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
const StaffDetail = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);
  if (!user) return null;
  console.log(user);
  return (
    <>
      <Descriptions
        title='User Info'
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label='Employee ID'>{user.emp_id}</Descriptions.Item>
        <Descriptions.Item label='First Name'>
          {user.first_name}
        </Descriptions.Item>
        <Descriptions.Item label='Last Name'>
          {user.last_name}
        </Descriptions.Item>

        <Descriptions.Item label='Email'>{user.email}</Descriptions.Item>
        <Descriptions.Item label='Department'>
          {user.department.name}
        </Descriptions.Item>
        <Descriptions.Item label='Employment Date'>
          {moment(user.employment_date).format('YYYY-MM-DD')}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title='Leave Balance' bordered>
        {Object.entries(user.leaveCount).map(([key, value]) => (
          <Descriptions.Item key={key} label={key}>
            {value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Button>
        <Link to='/users'>Back</Link>
      </Button>
    </>
  );
};

export default StaffDetail;
