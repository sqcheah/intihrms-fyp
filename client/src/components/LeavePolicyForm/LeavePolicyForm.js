import React, { useEffect, useState } from 'react';
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
import { PageLoading } from '@ant-design/pro-layout';
import { getLeaveTypes } from '../../actions/leaveTypes';
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
  const [loading, setLoading] = useState({ policy: false, leavetypes: false });
  const [selectedItems, setSelectedItems] = useState([]);

  const [form] = useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { policy, isLoading } = useSelector((state) => state.policy);
  const { leaveTypes } = useSelector((state) => state.leaveTypes);
  var filteredOptions = leaveTypes.filter(
    (lt) => !selectedItems.includes(lt._id)
  );
  useEffect(() => {
    if (id) {
      setLoading({ policy: true, leavetypes: true });
      console.log(policy);
      dispatch(getLeaveTypes()).then(() => {
        setLoading({ ...loading, leavetypes: false });
      });
      dispatch(getPolicy(id)).then(() => {
        form.setFieldsValue({ ...policy, policy: policy.list });
        setLoading({ ...loading, policy: false });
      });
    } else {
    }
  }, [dispatch, id]);
  const onFinish = (values) => {
    const r = {
      ...values,
      total: values.total.map((t) => {
        return { ...t, leavetype: t.leavetype.map((lt) => lt.key) };
      }),
    };
    console.log(r);

    console.log('Received values of form:', values);
    return;
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
  const onSelectChange = () => {
    const formValues = form.getFieldValue('total');
    const leavetypeArr = formValues.reduce(
      (all, item) => all.concat(item.leavetype?.map((l) => l.key)),
      []
    );
    setSelectedItems(leavetypeArr);
  };
  if (loading.policy || loading.leavetypes) return <PageLoading />;
  return (
    <Form
      form={form}
      name='dynamic_form_nest_item'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      {/**https://github.com/ant-design/ant-design/issues/7481#issuecomment-802830547 */}
      {/**https://stackoverflow.com/questions/61622292/antd-v4-how-to-add-nesting-in-form-list */}
      {/**https://stackoverflow.com/questions/62995077/how-to-make-ant-designs-form-list-required */}
      <Form.Item
        label='Name'
        name='name'
        rules={[
          { required: true, message: 'Missing name' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (getFieldValue('total') && getFieldValue('total').length) {
                return Promise.resolve();
              }
              return Promise.reject('Please add Policy');
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>

      <Form.List name='total'>
        {(fields1, { add: add1, remove: remove1 }) => (
          <>
            {fields1.map((field1) => (
              <div key={field1.key}>
                <Form.Item
                  {...field1}
                  name={[field1.name, 'leavetype']}
                  fieldKey={[field1.fieldKey, 'leavetype']}
                  rules={[
                    { required: true, message: 'Missing leavetype' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (
                          getFieldValue([field1.name, 'policy']) &&
                          getFieldValue([field1.name, 'policy']).length
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Please add Condition');
                      },
                    }),
                  ]}
                  valuePropName='label'
                >
                  <Select
                    allowClear
                    placeholder='Choose an option'
                    mode='multiple'
                    onChange={onSelectChange}
                    labelInValue
                    optionLabelProp='label'
                  >
                    {filteredOptions?.map((lt) => (
                      <Option key={lt._id} value={lt._id} label={lt.name}>
                        {lt.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.List name={[field1.name, 'policy']}>
                  {(policyFields, { add, remove }) => (
                    <>
                      <Form.Item name='stacked' valuePropName='checked'>
                        <Checkbox>Stacked</Checkbox>
                      </Form.Item>

                      <Alert
                        style={{ marginBottom: '50px' }}
                        description={`If stacked is selected, all 'After' conditions will apply cumulatively. If stacked is not selected, only the highest 'After' condition will apply`}
                        type='info'
                        showIcon
                      />
                      {policyFields.map((policyField) => (
                        <Space
                          key={'policy' + policyField.key}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            marginBottom: 8,
                          }}
                          align='baseline'
                        >
                          <Form.Item
                            {...policyField}
                            name={[policyField.name, 'condition1']}
                            fieldKey={[policyField.fieldKey, 'condition1']}
                            rules={[
                              { required: true, message: 'Missing condition1' },
                            ]}
                          >
                            <Select allowClear placeholder='Choose an option'>
                              <Option value='after'>After</Option>
                              <Option value='every'>Every</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...policyField}
                            name={[policyField.name, 'year']}
                            fieldKey={[policyField.fieldKey, 'year']}
                            rules={[
                              { required: true, message: 'Missing year' },
                            ]}
                          >
                            <InputNumber min={1} placeholder='Enter years' />
                          </Form.Item>
                          <>years, increase by </>
                          <Form.Item
                            {...policyField}
                            name={[policyField.name, 'increase']}
                            fieldKey={[policyField.fieldKey, 'increase']}
                            rules={[
                              { required: true, message: 'Missing increase' },
                            ]}
                          >
                            <InputNumber min={1} placeholder='Enter increase' />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(policyField.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type='dashed'
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Condition
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => remove1(field1.name)}
                    block
                    icon={<MinusCircleOutlined />}
                  >
                    Remove Policy
                  </Button>
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <Button
                type='dashed'
                onClick={() => add1()}
                block
                icon={<PlusOutlined />}
              >
                Add Policy
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
