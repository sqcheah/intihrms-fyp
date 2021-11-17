import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExtTraining } from '../../actions/training';
import { Spin, Table, Space, Button, Badge, Empty, Tag } from 'antd';

import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';

const ExtTrainingList = () => {
  const { trainings, isLoading } = useSelector((state) => state.trainings);
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(user);
    if (user.roles.name == 'admin')
      dispatch(fetchExtTraining('admin', user._id, user.department.name));
    else
      dispatch(fetchExtTraining('supervisor', user._id, user.department.name));
  }, [dispatch]);

  if (!trainings) return <PageLoading />;

  return (
    <>
      <h2>External Training Requests</h2>
      {!trainings.length ? (
        <Empty></Empty>
      ) : (
        <>
          <Table
            dataSource={trainings}
            rowKey='_id'
            style={{ overflowX: 'scroll' }}
          >
            <Table.Column
              title='Requester Name'
              dataIndex='user'
              key='user._id'
              render={(text, record) => `${text.first_name} ${text.last_name}`}
            ></Table.Column>
            <Table.Column
              title='Requester Department'
              dataIndex='department'
              key='department._id'
              render={(text, record) => `${text.name}`}
            ></Table.Column>
            <Table.Column
              title='Organizer'
              dataIndex='organization'
              key='organization'
            ></Table.Column>
            <Table.Column
              title='Title'
              dataIndex='title'
              key='title'
            ></Table.Column>
            <Table.Column
              title='Date'
              dataIndex='date'
              key='date'
              render={(text, record) => moment(text).format('YYYY-MM-DD')}
            ></Table.Column>
            <Table.Column
              title='Time'
              dataIndex='time'
              key='time'
            ></Table.Column>
            <Table.Column
              title='Duration(hours)'
              dataIndex='duration'
              key='duration'
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
                </Space>
              )}
            ></Table.Column>
          </Table>
        </>
      )}
      <Button>
        <Link to='/training'>Back</Link>
      </Button>
    </>
  );
};

export default ExtTrainingList;
