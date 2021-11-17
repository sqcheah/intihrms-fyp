import React, { createRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Tag,
  ConfigProvider,
  Space,
  Row,
  Col,
} from 'antd';
import 'antd/dist/antd.css';
import ProForm, {
  ProFormText,
  ProFormDigit,
  ProFormColorPicker,
} from '@ant-design/pro-form';
import styles from './LeaveTypeForm.less';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  createLeaveType,
  updateLeaveType,
  getLeaveType,
} from '../../actions/leaveTypes';
import enUSIntl from 'antd/lib/locale/en_US';

import { ChromePicker, SketchPicker } from 'react-color';
import { PageLoading } from '@ant-design/pro-layout';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const LeaveTypeForm = () => {
  const { id } = useParams();
  const [color, setColor] = useState('#39f983');
  const { leaveType, isLoading } = useSelector((state) => state.leaveTypes);
  const [loading, setLoading] = useState(false);
  const [colorState, setColorState] = useState({
    code: 'sample',
    color: 'blue',
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values) => {
    if (id) {
      dispatch(updateLeaveType(id, values));
    } else {
      dispatch(createLeaveType(values));
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);

      dispatch(getLeaveType(id)).then((data) => {
        form.setFieldsValue(data);
        setLoading(false);
      });
    }
  }, [dispatch, id]);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onValuesChange = (changedFields, allFields) => {
    console.log(changedFields, allFields);
    if (allFields.code != '' && allFields.color != '') setColorState(allFields);
  };
  if (isLoading) return <PageLoading />;
  return (
    <>
      <ConfigProvider locale={enUSIntl}>
        <ProForm
          onValuesChange={onValuesChange}
          form={form}
          name='basic'
          layout='horizontal'
          labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          formKey='base-form-use-demo'
          //https://github.com/ant-design/pro-components/issues/1027
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            render: (props, doms) => {
              return (
                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Space>{doms}</Space>
                </Form.Item>
              );
            },
          }}
        >
          <ProFormText
            name='code'
            label='Code'
            placeholder='Enter code'
            width='md'
            rules={[
              {
                required: true,
                message: 'Please input your reason!',
              },
            ]}
          />

          <ProFormText
            name='name'
            label='Name'
            placeholder='Enter Name'
            width='md'
            rules={[
              {
                required: true,
                message: 'Please input your reason!',
              },
            ]}
          />

          <ProFormDigit
            name='count'
            label='Count'
            width='md'
            rules={[
              {
                required: true,
                message: 'Please input your reason!',
              },
            ]}
          />

          <ProFormColorPicker
            name='color'
            initialValue='blue'
            label='color'
            rules={[
              {
                required: true,
                message: 'Please enter color',
              },
            ]}
          />
        </ProForm>
      </ConfigProvider>
      <Row>
        <Col offset={8}>
          <Space>
            Preview:
            <Tag color={colorState.color}>{colorState.code}</Tag>
          </Space>
        </Col>
      </Row>
      {/* 
      <ChromePicker color={color} onChangeComplete={handleChangeComplete} />
      <Tag color={color}>Sample</Tag>
      
      */}
    </>
  );
};
export default LeaveTypeForm;
/**
 *       <Form
        //form={form}
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
          label='Code'
          name='code'
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
          label='Name'
          name='name'
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
          label='Count'
          name='count'
          rules={[
            {
              required: true,
              message: 'Please input your reason!',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <ProFormColorPicker
          name='color'
          label='color'
          width='lg'
          rules={[
            {
              required: true,
              message: 'Please enter color',
            },
          ]}
        />
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
          <Button type='secondary' htmlType='button'>
            <Link to='/leaveTypes'>Back</Link>
          </Button>
        </Form.Item>
      </Form>
 */
