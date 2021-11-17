import React from 'react';
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
  const onFinish = (values) => {
    console.log('Received values of form:', values);
    const stacked = values.stacked;
    const policy = values.policy;
    if (policy) {
      const today = moment('2025-01-01');
      const employmentDate = moment('2010-01-01');
      const totalYears = today.diff(employmentDate, 'years');
      console.log(totalYears);
      let totalIncrease = 0;
      const policyAfter = policy.filter((p) => p.condition1 == 'after');
      const policyEvery = policy.filter((p) => p.condition1 == 'every');
      let highestAfter = 0;
      policyAfter.forEach((p) => {
        if (totalYears > p.year) {
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
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFieldsChange = () => {};
  return (
    <Form
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
      </Form.Item>
    </Form>
  );
};

export default LeavePolicy;
