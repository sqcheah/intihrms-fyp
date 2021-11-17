import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button, Select, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import 'antd/dist/antd.css';
import './DeptForm.css';
import { createDept } from '../../actions/depts';
const { Title } = Typography;
const DeptForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onFinish = (values) => {
    console.log('Success:', values);

    dispatch(createDept(values));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Title level={2}> Create Department</Title>
      <Form
        name='basic'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Code'
          name='code'
          rules={[
            {
              required: true,
              message: 'Please insert your code',
            },
          ]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item
          label='Name'
          name='name'
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
          <Button>
            <Link to='/depts'>Back</Link>
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DeptForm;
