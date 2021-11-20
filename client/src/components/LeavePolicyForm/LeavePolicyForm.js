import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Select,
  InputNumber,
  Checkbox,
  Tooltip,
  Alert,
} from 'antd';
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPolicy, getPolicy, updatePolicy } from '../../actions/policy';
import { useForm } from 'antd/lib/form/Form';
import { add } from 'lodash';
const { Option } = Select;

const calcEvery = (every, increase) => {
  let today = moment();
  let employmentDate = moment('2020-01-01');
  let totalYears = today.diff(employmentDate, 'y');
  let count = totalYears / every;
  return count * increase;
};
const calcAfter = (after, increase) => {
  let today = moment();
  let employmentDate = moment('2020-01-01');
  let totalYears = today.diff(employmentDate, 'y');
  if (totalYears > after) {
    return increase;
  }
  return 0;
};

const LeavePolicy = () => {
  const [form] = useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { policy } = useSelector((state) => state.policy);
  useEffect(() => {
    if (id) {
      dispatch(getPolicy(id));
    }
  }, [dispatch, id]);
  const onFinish = (values) => {
    console.log('Received values of form:', values);

    if (id) {
      dispatch(
        updatePolicy(id, {
          stacked: values.stacked,
          name: values.name,
          list: values.policy,
        })
      );
    } else {
      dispatch(
        createPolicy({
          stacked: values.stacked,
          name: values.name,
          list: values.policy,
        })
      );
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFieldsChange = () => {};
  return (
    <Form
      ref={form}
      initialValues={{ ...policy, policy: policy.list }}
      name='dynamic_form_nest_item'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onFieldsChange={onFieldsChange}
      autoComplete='off'
    >
      {/**https://github.com/ant-design/ant-design/issues/7481#issuecomment-802830547 */}
      <Space align='baseline'>
        <Form.Item name='stacked' valuePropName='checked'>
          <Checkbox>Stacked</Checkbox>
        </Form.Item>
        <Tooltip
          title={`If stacked is selected, all 'After' conditions will apply cumulatively. If stacked is not selected, only the highest 'After' condition will apply`}
        >
          <InfoCircleOutlined />
        </Tooltip>
      </Space>
      <Alert
        style={{ marginBottom: '50px' }}
        description={`If stacked is selected, all 'After' conditions will apply cumulatively. If stacked is not selected, only the highest 'After' condition will apply`}
        type='info'
        showIcon
      />
      <Form.Item label='Name' name='name'>
        <Input />
      </Form.Item>
      <Form.List name='policy'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space
                key={'name' + key}
                style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 8 }}
                align='baseline'
              >
                <Form.Item
                  {...restField}
                  name={[name, 'condition1']}
                  fieldKey={[fieldKey, 'condition1']}
                  rules={[{ required: true, message: 'Missing condition1' }]}
                >
                  <Select allowClear placeholder='Choose an option'>
                    <Option value='after'>After</Option>
                    <Option value='every'>Every</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'year']}
                  fieldKey={[fieldKey, 'year']}
                  rules={[{ required: true, message: 'Missing year' }]}
                >
                  <InputNumber min={1} placeholder='Enter years' />
                </Form.Item>
                <>years, increase by </>
                <Form.Item
                  {...restField}
                  name={[name, 'increase']}
                  fieldKey={[fieldKey, 'increase']}
                  rules={[{ required: true, message: 'Missing increase' }]}
                >
                  <InputNumber min={1} placeholder='Enter increase' />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type='dashed'
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
        <Button type='secondary' htmlType='button' onClick={() => navigate(-1)}>
          Back
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LeavePolicy;
