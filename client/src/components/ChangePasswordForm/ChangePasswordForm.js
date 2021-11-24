import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, resetPassword } from '../../actions/auth';
import { Typography, Form, Input, Button } from 'antd';
const ChangePasswordForm = ({ user }) => {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    console.log(values);

    dispatch(changePassword(user._id, { password: values.password }));
    //if (!error) setSubmitted(true);
    console.log('Success:', values);
    //  console.log(submitted && !isLoading && !error);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Change Password
      </Typography.Title>
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          name='password'
          label='Password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              pattern:
                '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
              message:
                'Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Confirm Password'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
              pattern:
                '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
              message:
                'Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 11 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePasswordForm;
