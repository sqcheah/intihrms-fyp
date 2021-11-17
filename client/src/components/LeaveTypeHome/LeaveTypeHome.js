import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Table, Space, Button } from 'antd';
import 'antd/dist/antd.css';
import './LeaveTypeHome.css';
import { Link, useHistory } from 'react-router-dom';
import { getLeaveTypes } from '../../actions/leaveTypes';
const { Column } = Table;
const LeaveTypeHome = () => {
  const { leaveTypes } = useSelector((state) => state.leaveTypes);
  const dispatch = useDispatch();
  console.log(leaveTypes);
  useEffect(() => {
    dispatch(getLeaveTypes());
  }, [dispatch]);
  const history = useHistory();
  const createLeaveType = () => {
    history.push('/leaveTypes/create');
  };
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={createLeaveType}>Create New Leave Type</Button>
      </Space>

      {!leaveTypes.length ? (
        <>
          <br />
          <Spin size='large' />
        </>
      ) : (
        <>
          <Table dataSource={leaveTypes} rowKey='_id'>
            <Column title='Code' dataIndex='code' key='code' />
            <Column title='Name' dataIndex='name' key='name' />
            <Column title='Count' dataIndex='count' key='count' />
            <Column
              title='Action'
              key='action'
              render={(text, record) => (
                <Space size='middle'>
                  <Button>
                    <Link to={`/leaveTypes/edit/${record._id}`}>Edit</Link>
                  </Button>
                </Space>
              )}
            />
          </Table>
          <Button type='secondary' htmlType='button'>
            <Link to='/'>Back</Link>
          </Button>
        </>
      )}
    </>
  );
};

export default LeaveTypeHome;
