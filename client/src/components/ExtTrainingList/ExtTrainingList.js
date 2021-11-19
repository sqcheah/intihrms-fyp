import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExtTraining } from '../../actions/training';
import { getDepts } from '../../actions/depts';
import {
  Spin,
  Table,
  Space,
  Button,
  Badge,
  Empty,
  Tag,
  ConfigProvider,
  Dropdown,
  Menu,
} from 'antd';
import {
  PlusOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import enUSIntl from 'antd/lib/locale/en_US';

const ExtTrainingList = () => {
  const { trainings, isLoading } = useSelector((state) => state.trainings);
  const { depts } = useSelector((state) => state.depts);
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchExtTraining(user.roles.name, user._id, user.department.name));
    dispatch(getDepts());
  }, [dispatch]);
  var deptFilters = [];
  const statusFilter = [
    { text: 'Pending', value: 'pending' },
    { text: 'Approved', value: 'approve' },
    { text: 'Rejected', value: 'reject' },
  ];

  depts.forEach((element) => {
    deptFilters.push({ text: element.name, value: element.name });
  });

  const columns = [
    {
      title: 'Requester Name',
      dataIndex: 'user',
      key: 'user',
      valueType: 'text',
      render: (text, record) => `${text.first_name} ${text.last_name}`,
    },
    {
      title: 'Requester Department',
      dataIndex: ['department', 'name'],
      key: 'department',

      filters: deptFilters,
      onFilter: (value, record) => record.department.name.indexOf(value) === 0,
    },
    { title: 'Organizer', dataIndex: 'organization', key: 'organization' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      valueType: 'date',
      sorter: (a, b) => moment(a.date) - moment(b.date),
      render: (text, record) => moment(record.date).format('YYYY-MM-DD'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      hideInSearch: true,
    },
    {
      title: 'Duration(hours)',
      dataIndex: 'duration',
      key: 'duration',
      hideInSearch: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilter,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text, record) => (
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
      ),
    },
    {
      title: 'Action',
      key: '_id',
      valueType: 'option',
      render: (text, record) => (
        <Space size='middle' key={record._id}>
          <Link to={`view/${record._id}`}>View</Link>
        </Space>
      ),
    },
  ];
  const actionRef = useRef();

  if (isLoading) return <PageLoading />;

  return (
    <>
      <h2>External Training Requests</h2>
      {!trainings.length ? (
        <Empty></Empty>
      ) : (
        <>
          <ConfigProvider locale={enUSIntl}>
            <ProTable
              columns={columns}
              actionRef={actionRef}
              request={(params, sorter, filter) => {
                let dataSource = trainings.reverse();
                if (params) {
                  if (Object.keys(params).length > 0) {
                    dataSource = dataSource.filter((item) => {
                      return Object.keys(params).every((key) => {
                        console.log(Object.keys(params));
                        if (!params[key]) {
                          return true;
                        }
                        if (key == 'pageSize' || key == 'current') {
                          return true;
                        }

                        if (params[key] == 'all') {
                          return true;
                        }
                        let val = item[key];
                        if (key == 'user') {
                          val = `${item.user.first_name} ${item.user.last_name}`;
                        } else if (key == 'department') {
                          val = `${item.department.name}`;
                        }
                        if (!val) {
                          return true;
                        }
                        if (
                          val.search(
                            new RegExp('.*' + params[key] + '.*', 'gi')
                          ) != -1
                        ) {
                          return true;
                        }
                        return false;
                      });
                    });
                  }
                }

                return Promise.resolve({
                  data: dataSource,
                  success: true,
                });
              }}
              rowKey='_id'
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
              }}
              search={{
                layout: 'vertical',
                defaultCollapsed: true,
                span: 6,
              }}
              dateFormatter='string'
              toolbar={{
                title: 'Tips:',
                tooltip:
                  'Use the search bar above or filter icons on the columns for easy record finding',
              }}
            />
          </ConfigProvider>
        </>
      )}
    </>
  );
};

export default ExtTrainingList;

/**<Table
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
          </Table> */
