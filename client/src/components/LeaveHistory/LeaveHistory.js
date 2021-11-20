import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveHistory } from '../../actions/leaves';
import { getLeaveTypes } from '../../actions/leaveTypes';
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

import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';
import {
  PlusOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import enUSIntl from 'antd/lib/locale/en_US';

const LeaveHistory = () => {
  const { leaves, isLoading } = useSelector((state) => state.leaves);
  const { leaveTypes } = useSelector((state) => state.leaveTypes);
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const statusFilter = [
    { text: 'Pending', value: 'pending' },
    { text: 'Approved', value: 'approve' },
    { text: 'Rejected', value: 'reject' },
  ];
  var typeFilter = [];

  useEffect(() => {
    dispatch(fetchLeaveHistory(user._id));
    dispatch(getLeaveTypes());
  }, [dispatch]);

  leaveTypes.map((element) => {
    typeFilter.push({ text: element.name, value: element.code });
  });

  const applyLeave = () => {
    navigate('/leaves/create');
  };

  const actionRef = useRef();

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      filters: typeFilter,
      onFilter: (value, record) => record.leaveType.indexOf(value) === 0,
      render: (text, record) => <Tag color='red'>{text}</Tag>,
    },
    {
      title: 'Start Date',
      dataIndex: 'fromDate',
      key: 'fromDate',
      valueType: 'date',
      sorter: (a, b) => moment(a.fromDate) - moment(b.fromDate),
      render: (text, record) => moment(record.fromDate).format('YYYY-MM-DD'),
    },
    {
      title: 'End Date',
      dataIndex: 'toDate',
      key: 'toDate',
      valueType: 'date',
      sorter: (a, b) => moment(a.toDate) - moment(b.toDate),
      render: (text, record) => moment(record.toDate).format('YYYY-MM-DD'),
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
          {record.status == 'pending' && (
            <Link to={`/leaves/edit/${record._id}`}>Edit</Link>
          )}
        </Space>
      ),
    },
  ];

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
          <ConfigProvider locale={enUSIntl}>
            <ProTable
              rowKey='id'
              columns={columns}
              actionRef={actionRef}
              request={(params, sorter, filter) => {
                let dataSource = leaves.reverse();

                if (filter) {
                  if (Object.keys(filter).length > 0) {
                    dataSource = dataSource.filter((item) => {
                      return Object.keys(filter).some((key) => {
                        if (!filter[key]) {
                          return true;
                        }
                        if (filter[key].includes(`${item[key]}`)) {
                          return true;
                        }
                        return false;
                      });
                    });
                  }
                }
                if (params) {
                  if (Object.keys(params).length > 0) {
                    dataSource = dataSource.filter((item) => {
                      return Object.keys(params).every((key) => {
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
              toolBarRender={() => [
                <Button type='primary' key='primary'>
                  <Link to='/leaves/create'>Apply Leave</Link>
                </Button>,
              ]}
            />
          </ConfigProvider>
        </>
      )}
      <Button>
        <Link to='/leaves/'>Back</Link>
      </Button>
    </>
  );
};

export default LeaveHistory;

/**<Table
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
          </Table> */
