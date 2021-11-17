import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExtTrainingHistory,
  fetchTrainingHistory,
} from '../../actions/training';
import { Spin, Table, Space, Button, Badge, Empty, Tag } from 'antd';

import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';

const TrainingHistory = () => {
  const { trainings, extTrainings, isLoading } = useSelector(
    (state) => state.trainings
  );
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchExtTrainingHistory(user._id));
    dispatch(fetchTrainingHistory(user._id));
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  return (
    <>
      <h3>Your External Training Requests</h3>
      {extTrainings &&
        (!extTrainings.length ? (
          <Empty></Empty>
        ) : (
          <>
            <Table
              dataSource={extTrainings}
              rowKey='_id'
              style={{ overflowX: 'scroll' }}
            >
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
            <br></br>
            <br></br>
          </>
        ))}

      <h3>Attending/Hosting Internal Training</h3>
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

export default TrainingHistory;
