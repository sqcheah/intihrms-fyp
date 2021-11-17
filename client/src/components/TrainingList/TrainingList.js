import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTrainings } from '../../actions/training';
import { Spin, Table, Space, Button, Badge, Empty, Tag } from 'antd';

import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';

const TrainingList = () => {
  const { trainings, isLoading } = useSelector((state) => state.trainings);
  const history = useHistory();
  const createTraining = () => {
    history.push('/training/create');
  };
  const createExtTraining = () => {
    history.push('/training/submitExt');
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllTrainings());
  }, [dispatch]);
  console.log(isLoading);
  if (isLoading) return <PageLoading />;
  return (
    <>
      <h2>Internal Training List</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={createTraining}>Create Training</Button>
        <Button onClick={createExtTraining}>
          Submit External Training Request
        </Button>
      </Space>
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
              title='Organizer'
              dataIndex='user'
              key='user._id'
              render={(text, record) => `${text.first_name} ${text.last_name}`}
            ></Table.Column>
            <Table.Column
              title='Department ID'
              dataIndex='department'
              key='department._id'
              render={(text, record) => `${text.name}`}
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

export default TrainingList;
