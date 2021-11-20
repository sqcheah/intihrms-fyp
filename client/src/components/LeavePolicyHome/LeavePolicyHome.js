import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Table, Space, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { getPolicies } from '../../actions/policy';
const { Column } = Table;
const RoleHome = () => {
  const { policies } = useSelector((state) => state.policy);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPolicies());
  }, [dispatch]);
  const navigate = useNavigate();
  const createPolicy = () => {
    navigate('/policy/create');
  };
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={createPolicy}>Add Policy</Button>
      </Space>
      <br />
      {!policies.length ? (
        <>
          <Spin size='large' />
        </>
      ) : (
        <>
          <Table dataSource={policies} rowKey='_id'>
            <Column
              title='Policy'
              dataIndex='list'
              key='list'
              render={(text, record) =>
                text.map((t, i) => (
                  <p
                    key={i}
                  >{`${t.condition1} ${t.year} years, increase by ${t.increase}`}</p>
                ))
              }
            />
            <Column
              title='Action'
              key='action'
              render={(text, record) => (
                <Space size='middle'>
                  <Button>
                    <Link to={`/policy/edit/${record._id}`}>Edit</Link>
                  </Button>
                </Space>
              )}
            />
          </Table>
        </>
      )}
      <Button>
        <Link to='/'>Back</Link>
      </Button>
    </>
  );
};

export default RoleHome;
