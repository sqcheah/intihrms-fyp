import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import './Profile.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Descriptions, Badge, Button } from 'antd';
import { getUser } from '../../actions/users';
import { Link } from 'react-router-dom';
import moment from 'moment';

//Divider Library From ant design
import { Divider } from 'antd';

//Profile Image Library
import { Image } from 'antd';

//Text
import { Typography } from 'antd';

//Spacing Test
import { Space } from 'antd';
const { Text } = Typography;

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('profile')).result;
  console.log('user', user);

  function ZoomIn() {
    return (
      <Image
        width={200}
        src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      />
    );
  }

  return (
    <>
      <Divider>
        <Text style={{ fontSize: 23 }}>Profile Page</Text>
      </Divider>
      <center>
        <div>
          <ZoomIn />
        </div>
      </center>

      <Descriptions
        title='Profile Details'
        bordered
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
        {Object.entries(user.leaveCount).map(([key, value]) => (
          <Descriptions.Item key={key} label={key}>
            {value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Button>
        <Link to='/'>Back to Home</Link>
      </Button>
    </>
  );
};
//https://flexiple.com/loop-through-object-javascript/

export default Profile;
