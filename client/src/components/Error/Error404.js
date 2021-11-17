import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const Error404 = () => {
  const history = useHistory();
  const toHome = () => {
    history.push('/');
  };
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button onClick={toHome} type='primary'>
          Back Home
        </Button>
      }
    />
  );
};

export default Error404;
