import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
} from 'antd';
import 'antd/dist/antd.css';
import './StaffForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../actions/users';
import { getDepts } from '../../actions/depts';
import { getRoles } from '../../actions/roles';
import { getLeaveTypes } from '../../actions/leaveTypes';
import { Link } from 'react-router-dom';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const StaffForm = () => {
  const [password, setPassword] = useState('');
  const [staff, setStaff] = useState({
    emp_id: '',
    first_name: '',
    last_name: '',
    email: '',
    employment_date: '',
    password: 'test',
    department: '',
    roles: '',
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRoles());
    dispatch(getDepts());
    dispatch(getLeaveTypes());
  }, [dispatch]);
  const { depts } = useSelector((state) => state.depts);
  const { roles } = useSelector((state) => state.roles);
  const { leaveTypes } = useSelector((state) => state.leaveTypes);
  const onFinish = (values) => {
    dispatch(
      createUser({
        emp_id: values.emp_id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        employment_date: values['employment_date'].format('YYYY-MM-DD'),
        password: 'test',
        department: values.department,
        roles: values.roles,
      })
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
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
        label='Employee ID'
        name='emp_id'
        rules={[
          {
            required: true,
            message: 'Please insert a title!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='First Name'
        name='first_name'
        rules={[
          {
            required: true,
            message: 'Please insert a title!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Last Name'
        name='last_name'
        rules={[
          {
            required: true,
            message: 'Please input your reason!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {leaveTypes.map((leaveType) => (
        <Form.Item
          key={leaveType._id}
          label={leaveType.name}
          name={leaveType.name}
          initialValue={leaveType.count}
          rules={[
            {
              required: true,
              message: 'Please input your reason!',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      ))}
      <Form.Item
        label='Email'
        name='email'
        rules={[
          {
            required: true,
            message: 'Please input your leaveType!',
          },
        ]}
      >
        <Input type='email' />
      </Form.Item>
      <Form.Item
        label='Employment Date'
        name='employment_date'
        rules={[
          {
            required: true,
            message: 'Please insert a title!',
          },
        ]}
      >
        <DatePicker placeholder='hi' />
      </Form.Item>
      <Form.Item
        label='Department'
        name='department'
        rules={[
          {
            required: true,
            message: 'Please insert a title!',
          },
        ]}
      >
        <Select>
          {depts.map((dept) => (
            <Option key={dept._id} value={dept._id}>
              {dept.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label='Roles'
        name='roles'
        rules={[
          {
            required: true,
            message: 'Please insert a title!',
          },
        ]}
      >
        <Select>
          {roles.map((role) => (
            <Option key={role._id} value={role._id}>
              {role.name}
            </Option>
          ))}
        </Select>
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
          <Link to='/users'>Back</Link>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StaffForm;
