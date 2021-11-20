import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTrainings } from '../../actions/training';
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

import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import enUSIntl from 'antd/lib/locale/en_US';

const TrainingList = () => {
  const { trainings, isLoading } = useSelector((state) => state.trainings);
  const { depts } = useSelector((state) => state.depts);
  const navigate = useNavigate();
  var deptFilters = [];

  const createTraining = () => {
    navigate('/training/create');
  };
  const createExtTraining = () => {
    navigate('/training/submitExt');
  };
  const calcAttendance = (data) => {
    var temp = data.filter(function (item) {
      return item.status == 'Approved';
    }).length;
    return temp;
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllTrainings());
    dispatch(getDepts());
  }, [dispatch]);
  console.log(trainings);

  depts.forEach((element) => {
    deptFilters.push({ text: element.name, value: element.name });
  });

  const columns = [
    {
      title: 'Organizer',
      dataIndex: 'organizer',
      key: 'organizer',
      valueType: 'text',
      //render: (text, record) => `${text.first_name} ${text.last_name}`,
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
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
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      hideInSearch: true,
      render: (text, record) => `${record.fromTime} - ${record.toTime}`,
    },
    {
      title: 'Total Duration(hours)',
      dataIndex: 'duration',
      key: 'duration',
      render: (text, record) =>
        moment
          .utc(moment.duration(record.duration, 'hours').asMilliseconds())
          .format('HH [hours] mm [minutes]'),
      hideInSearch: true,
    },
    {
      title: 'Attendants',
      dataIndex: 'attendants',
      key: 'attendants',
      hideInSearch: true,
      sorter: (a, b) => calcAttendance(a.attendants) - calcAttendance(b.attendants),
      render: (text, record) => calcAttendance(record.attendants),
    },
    {
      title: 'Action',
      key: '_id',
      valueType: 'option',
      render: (text, record) => (
        <Space size='middle' key={record._id}>
          <Link to={`/training/view/${record._id}`}>View</Link>
        </Space>
      ),
    },
  ];
  const actionRef = useRef();
  if (isLoading) return <PageLoading />;
  return (
    <>
      <h2>Internal Training List</h2>
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

export default TrainingList;

/**
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
          </Table> */
