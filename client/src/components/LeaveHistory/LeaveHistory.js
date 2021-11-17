import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveHistory } from '../../actions/leaves';
import { Spin, Table, Space, Button, Badge, Empty, Tag } from 'antd';

import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';

const LeaveHistory = () => {
  const { leaves, isLoading } = useSelector((state) => state.leaves);
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchLeaveHistory(user._id));
  }, [dispatch]);

  const applyLeave = () => {
    history.push('/leaves/create');
  };

  if (isLoading) return <PageLoading />;

  return (
    <>
      <h2>My Leave Applications</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={applyLeave}>Apply Leave</Button>
      </Space>
      {!leaves.length ? (
        <Empty></Empty>
      ) : (
        <>
          <Table
            dataSource={leaves}
            rowKey='_id'
            style={{ overflowX: 'scroll' }}
          >
            <Table.Column
              title='Employee Name'
              dataIndex='user'
              key='user._id'
              render={(text, record) =>
                `${text?.first_name} ${text?.last_name}`
              }
            ></Table.Column>
            <Table.Column
              title='Department ID'
              dataIndex='department'
              key='department._id'
              render={(text, record) => `${text?.name}`}
            ></Table.Column>
            <Table.Column
              title='Leave Type'
              dataIndex='leaveType'
              key='leaveType'
              render={(text, record) => <Tag color='red'>{text}</Tag>}
            ></Table.Column>
            <Table.Column
              title='Start Date'
              dataIndex='fromDate'
              key='fromDate'
              render={(text, record) => moment(text).format('YYYY-MM-DD')}
            ></Table.Column>
            <Table.Column
              title='End Date'
              dataIndex='toDate'
              key='toDate'
              render={(text, record) => moment(text).format('YYYY-MM-DD')}
            ></Table.Column>
            <Table.Column
              title='Status'
              dataIndex='status'
              key='status'
              render={(text, record) => (
                <Badge
                  status={
                    record.status == 'pending'
                      ? 'processing'
                      : record.status == 'approve'
                      ? 'success'
                      : 'error'
                  }
                  text={record.status}
                />
              )}
            ></Table.Column>
            <Table.Column
              title='Action'
              key='action'
              render={(text, record) => (
                <Space size='middle' key={record._id}>
                  <Link to={`view/${record._id}`}>View</Link>
                  {record.status == 'pending' && (
                    <Link to={`/leaves/edit/${record._id}`}>Edit</Link>
                  )}
                </Space>
              )}
            ></Table.Column>
          </Table>
        </>
      )}
      <Button>
        <Link to='/leaves/'>Back</Link>
      </Button>
    </>
  );
};

export default LeaveHistory;
