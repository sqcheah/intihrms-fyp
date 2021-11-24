import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Typography, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import './Auth.css';
import { signIn } from '../../actions/auth';
const { Title } = Typography;
const Auth = () => {
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch(signIn(values, navigate)).then(() => {
      if (error) {
        Modal.error({ content: error });
      }
    });
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
