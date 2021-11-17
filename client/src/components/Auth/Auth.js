import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button, Select, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import 'antd/dist/antd.css';
import './Auth.css';
import { signIn } from '../../actions/auth';
const { Title } = Typography;
const Auth = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onFinish = (values) => {
    dispatch(signIn(values, history));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Title
        level={2}
        style={{ margin: '0 auto', textAlign: 'center', padding: '20px' }}
      >
        Sign In
      </Title>

      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        name='basic'
        initialValues={{
          email: 'LarLex579@gmail.com',
          password: 'test',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: 'Please insert your email',
            },
          ]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 10,
          }}
        >
          <Button type='primary' htmlType='submit'>
            Sign In
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <Link to='/resetPassword'>Forgot Password</Link>
      </div>
    </>
  );
};

export default Auth;
