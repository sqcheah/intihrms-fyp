import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Typography, Modal } from 'antd';
import { useDispatch } from 'react-redux';

import './DeptForm.css';
import { createDept, getDept, updateDept } from '../../actions/depts';
import { useForm } from 'antd/lib/form/Form';
import { PageLoading } from '@ant-design/pro-layout';
import { userInfo } from 'os';
const { Title } = Typography;
const DeptForm = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log('Success:', values);
    if (id) {
      dispatch(updateDept(id, values));
      Modal.success({
        content: 'Department updated',
        onOk() {
          navigate('/depts');
        },
      });
    } else {
      dispatch(createDept(values));
    }
  };
  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getDept(id)).then((data) => {
        form.setFieldsValue(data);
        setLoading(false);
        console.log(data);
      });
    }
  }, [dispatch, id]);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  if (loading) return <PageLoading />;
  return (
    <>
      <Title level={2}> Create Department</Title>
      <Form
        form={form}
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
