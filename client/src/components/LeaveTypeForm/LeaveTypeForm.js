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
  Modal,
} from 'antd';

import ProForm, {
  ProFormText,
  ProFormDigit,
  ProFormColorPicker,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-form';
import styles from './LeaveTypeForm.less';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  createLeaveType,
  updateLeaveType,
  getLeaveType,
} from '../../actions/leaveTypes';
import enUSIntl from 'antd/lib/locale/en_US';
import moment from 'moment';
import { ChromePicker, SketchPicker } from 'react-color';

import { PageLoading } from '@ant-design/pro-layout';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
//https://stackoverflow.com/a/68880332
const isBlank = (str) => {
  return !!!str || /^\s*$/.test(str);
};
const LeaveTypeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [color, setColor] = useState('#39f983');
  const { leaveType, isLoading, success, error } = useSelector(
    (state) => state.leaveTypes
  );
  const [loading, setLoading] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const [colorState, setColorState] = useState({
    code: 'sample',
    color: 'blue',
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log(values);
    let start, end;
    const startValue =
      values.startDate == 'custom' ? values.customStartDate : values.startDate;
    const endValue =
      values.endDate == 'custom' ? values.customEndDate : values.endDate;
    if (startValue == 'year' || startValue == 'month') {
      start = moment().startOf(startValue);
    } else {
      console.log(startValue);
      const operator = startValue.charAt(0);
      const day = parseInt(startValue.substring(1));
      if (operator == '+') {
        start = moment().add(day, 'days');
      } else {
        start = moment().subtract(day, 'days');
      }
    }
    if (endValue == 'year' || endValue == 'month') {
      end = moment().endOf(endValue);
    } else {
      const operator = endValue.charAt(0);
      const day = parseInt(endValue.substring(1));
      if (operator == '+') {
        end = moment().add(day, 'days');
      } else {
        end = moment().subtract(day, 'days');
      }
    }

    if (end.diff(start, 'days') < 0) {
      Modal.error({
        content: 'End date must be later than start date',
      });
    }
    console.log(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));

    if (id) {
      dispatch(
        updateLeaveType(id, {
          ...values,
          startDate: startValue,
          endDate: endValue,
        })
      );
      Modal.success({
        content: 'Leave type updated',
        onOk() {
          navigate('/leaveTypes');
        },
      });
    } else {
      dispatch(
        createLeaveType({ ...values, startDate: startValue, endDate: endValue })
      );
      Modal.success({
        content: 'Leave type created',
        onOk() {
          navigate('/leaveTypes');
        },
      });
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);

      dispatch(getLeaveType(id)).then((data) => {
        form.setFieldsValue(data);
        setLoading(false);
        setColorState({ code: data.code, color: data.color });
      });
    }
  }, [dispatch, id]);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onValuesChange = (changedFields, allFields) => {
    if (changedFields.color || changedFields.code) {
      setColorState({
        code: changedFields.code
          ? changedFields.code
          : isBlank(colorState.code)
          ? 'sample'
          : colorState.code,
        color: changedFields.color ? changedFields.color : colorState.color,
      });
    }
  };
  const onNameChange = (event) => {
    const value = event.target.value;
    const autoCode = value.toLowerCase().split(' ')[0];
    form.setFieldsValue({ code: autoCode });
    setColorState({ ...colorState, code: autoCode });
  };

  const onStartChange = (e) => {
    if (e.target.value == 'custom') {
      setShowStart(true);
    } else {
      setShowStart(false);
    }
  };

  const onEndChange = (e) => {
    if (e.target.value == 'custom') {
      setShowEnd(true);
    } else {
      setShowEnd(false);
    }
  };

  if (loading) return <PageLoading />;
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
            name='name'
            label='Name'
            placeholder='Enter Name'
            tooltip='Press enter to autofill short name'
            fieldProps={{ onPressEnter: onNameChange }}
            width='md'
            rules={[
              {
                required: true,
                message: 'Please input your reason!',
              },
            ]}
          />
          <ProFormText
            name='code'
            label='Short Name'
            placeholder='Enter Short Name'
            tooltip='This field is meant for display purpose'
            width='md'
            rules={[
              {
                required: true,
              },
            ]}
          />

          <ProFormDigit
            name='count'
            label='Default Count'
            placeholder='Enter Default count'
            width='md'
            rules={[
              {
                required: true,
              },
              {
                type: 'number',
                min: 0,
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

          <ProFormRadio.Group
            fieldProps={{ onChange: onStartChange }}
            initialValue='year'
            options={[
              {
                value: 'year',
                label: 'Year',
              },
              {
                value: 'month',
                label: 'Month',
              },
              {
                value: 'custom',
                label: 'Custom',
              },
            ]}
            name='startDate'
            label={'Start Date'}
          />
          {showStart && (
            <ProFormText
              validate
              name='customStartDate'
              label='Start Date'
              tooltip='Number of days from now. Format: +/- number Eg: -7'
              placeholder='+ or - with numbers eg: -7'
              rules={[
                { required: true },
                { pattern: '[+-][\\d]+', message: 'Invalid Format' },
              ]}
            />
          )}
          <ProFormRadio.Group
            fieldProps={{ onChange: onEndChange }}
            initialValue='year'
            options={[
              {
                value: 'year',
                label: 'Year',
              },
              {
                value: 'month',
                label: 'Month',
              },
              {
                value: 'custom',
                label: 'Custom',
              },
            ]}
            name='endDate'
            label={'End Date'}
          />
          {showEnd && (
            <ProFormText
              name='customEndDate'
              label='End Date'
              tooltip='Number of days from now. Format: +/- number Eg: +7'
              placeholder='+ or - with numbers eg: +7'
              rules={[
                { required: true },
                { pattern: '[+-][\\d]+', message: 'Invalid Format' },
              ]}
            />
          )}
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
