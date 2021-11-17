import React from 'react';

const ChangePasswordForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    dispatch(resetPassword(values.email));
    if (!error) setSubmitted(true);
    console.log('Success:', values);
    //  console.log(submitted && !isLoading && !error);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Reset Password
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
          label='Email'
          name='email'
          initialValue='LarLex579@gmail.com'
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>
        {submitted && !error && <Alert message='Email sent' type='success' />}
        <Form.Item wrapperCol={{ offset: 11 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <Link to='/auth'>Back to Login</Link>
      </div>
    </>
  );
};

export default ChangePasswordForm;
