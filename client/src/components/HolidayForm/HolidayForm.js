import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  DatePicker,
  Modal,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  createHoliday,
  updateHoliday,
  getHoliday,
} from '../../actions/holidays';

import './HolidayForm.css';
import moment from 'moment';
import PageLoading from '../PageLoading/PageLoading';
const { Title } = Typography;
const DeptForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { year, id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { holiday, isLoading, success, error } = useSelector(
    (state) => state.holidays
  );
  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getHoliday(year, id)).then((data) => {
        setLoading(false);
        const value = data[0];
        form.setFieldsValue({
          ...value,
          'range-picker': [moment(value.startDate), moment(value.endDate)],
        });
      });
      console.log(holiday);
    }
  }, [dispatch, id]);

  const onFinish = (values) => {
    console.log('Success:', values);

    const rangeValue = values['range-picker'];
    const startDate = rangeValue[0];
    const endDate = rangeValue[1];
    if (id) {
      dispatch(
        updateHoliday(year, id, {
          title: values.title,
          description: values.description,
          startDate,
          endDate,
        })
      );
      Modal.success({
        content: 'Holiday Updated',
        onOk() {
          navigate('/holidays');
        },
      });
    } else {
      dispatch(
        createHoliday({
          year: year,
          holiday: {
            title: values.title,
            description: values.description,
            startDate,
            endDate,
          },
        })
      );
      Modal.success({
        content: 'Holiday created',
        onOk() {
          navigate('/holidays');
        },
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  if (loading) return <PageLoading />;
  return (
    <>
      <Title level={2}> {id ? 'Edit Holiday' : 'Create Holiday'}</Title>
      <Form
        form={form}
        name='basic'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DeptForm;
