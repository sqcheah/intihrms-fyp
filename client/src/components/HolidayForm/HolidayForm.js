import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Typography, DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { createHoliday } from '../../actions/holidays';
import 'antd/dist/antd.css';
import './HolidayForm.css';
const { Title } = Typography;
const DeptForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const onFinish = (values) => {
    console.log('Success:', values);
    const rangeValue = values['range-picker'];
    const startDate = rangeValue[0];
    const endDate = rangeValue[1];
    dispatch(
      createHoliday({
        year: id,
        holiday: {
          title: values.title,
          decription: values.description,
          startDate,
          endDate,
        },
      })
    );
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
          label='Title'
          name='title'
          rules={[
            {
              required: true,
              message: 'Please input your title!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='description' name='description'>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label='Date'
          name='range-picker'
          rules={[
            {
              required: true,
              message: 'Please input your date!',
            },
          ]}
        >
          <DatePicker.RangePicker />
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
            <Link to='/holidays'>Back</Link>
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DeptForm;
