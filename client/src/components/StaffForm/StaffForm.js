import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Divider,
  Col,
} from 'antd';

import './StaffForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../actions/users';
import { getDepts } from '../../actions/depts';
import { getRoles } from '../../actions/roles';
import { getLeaveTypes } from '../../actions/leaveTypes';
import { Link } from 'react-router-dom';
import { getPolicy } from '../../actions/policy';

import moment from 'moment';
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
    dispatch(getPolicy({ name: 'defaultPolicy' }));
  }, [dispatch]);
  const { depts } = useSelector((state) => state.depts);
  const { roles } = useSelector((state) => state.roles);
  const { policy } = useSelector((state) => state.policy);
  const { leaveTypes } = useSelector((state) => state.leaveTypes);
  const onFinish = (values) => {
    console.log(values);
    const leaveCount = [];
    for (const [key, value] of Object.entries(values.leaveType)) {
      leaveCount.push({ leaveType: key, count: value });
    }
    console.log(leaveCount);

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
        leaveCount: leaveCount,
      })
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onDateChange = (val) => {
    const stacked = policy.stacked;
    const policy = policy.list;
    if (policy) {
      const today = moment('2025-01-01');
      const employmentDate = moment(val);
      const totalYears = today.diff(employmentDate, 'years');
      console.log(totalYears);
      let totalIncrease = 0;
      const policyAfter = policy.filter((p) => p.condition1 == 'after');
      const policyEvery = policy.filter((p) => p.condition1 == 'every');
      let highestAfter = 0;
      policyAfter.forEach((p) => {
        if (totalYears >= p.year) {
          if (stacked) {
            totalIncrease += p.increase;
          } else {
            if (p.year > highestAfter) {
              totalIncrease = p.increase;
              highestAfter = p.year;
            }
          }
        }
      });
      policyEvery.forEach((p) => {
        const count = totalYears / p.year;
        totalIncrease += count * p.increase;
      });

      console.log(totalIncrease);
    }
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
        <DatePicker placeholder='Enter employment date' />
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
        label='Training Hours'
        name='trainingHours'
        initialValue={60}
        rules={[
          {
            required: true,
            message: 'Please input your reason!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      {/**<Divider  orientation='leftText'>Leave</Divider>*/}
      {leaveTypes.map((leaveType) => (
        <Form.Item
          key={leaveType._id}
          label={leaveType.name}
          name={[['leaveType'], [leaveType._id]]}
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
