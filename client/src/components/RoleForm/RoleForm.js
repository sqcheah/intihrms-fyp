import React, { createRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Checkbox,
  Typography,
} from 'antd';
import 'antd/dist/antd.css';
import './RoleForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { createRole, getRole, updateRole } from '../../actions/roles';
import { PERMISSIONS } from '../../constants/permissions';

const RoleForm = () => {
  const modules = PERMISSIONS.map((list) => list.modules);
  const { id } = useParams();
  const { role } = useSelector((state) => state.roles);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values) => {
    console.log(values);
    let lists = [];
    for (let i of modules) lists = lists.concat(values[i]);

    //PERMISSIONS.map((list) => (lists = lists.concat(values[list.modules])));
    //https://stackoverflow.com/a/44971570
    // for (let key in modules) lists = lists.concat(values[key].filter);
    console.log(lists);

    if (id) {
      dispatch(updateRole(id, { ...values, permissions: lists }));
    } else {
      dispatch(createRole({ ...values, permissions: lists }));
    }
  };
  useEffect(() => {
    if (id) {
      dispatch(getRole(id));
      const fields = modules.map((module) => {
        return { [module]: role.permissions };
      });
      form.setFieldsValue({ ...role, ...fields });
    }
  }, [dispatch, id]);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onChange = () => {};

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item
        label='Name'
        name='name'
        rules={[
          {
            required: true,
            message: 'Please insert a role name!',
          },
        ]}
      >
        <Input onChange={onChange} />
      </Form.Item>
      <Form.Item
        label='ShortName'
        name='code'
        rules={[
          {
            required: true,
            message: 'Please insert a role name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {PERMISSIONS.map((list) => {
        const options = list.permissions.map((permission) => {
          return {
            key: permission.code,
            label: permission.name,
            value: permission.code,
          };
        });
        return (
          <>
            <Form.Item
              wrapperCol={{
                offset: 7,
                span: 16,
              }}
              labelCol={{ offset: 7, span: 24 }}
              key={list.modules}
              name={list.modules}
              label={list.modules}
            >
              <Checkbox.Group options={options} defaultValue={[]} />
            </Form.Item>
          </>
        );
      })}
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Space>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
          <Button type='secondary' htmlType='button'>
            <Link to='/roles'>Back</Link>
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default RoleForm;
