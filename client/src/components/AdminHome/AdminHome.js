import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  Row,
  Col,
  Card,
  Typography,
  Empty,
  Table,
  Tag,
  Space,
  Button,
  Descriptions,
  Alert,
  List,
  Modal,
} from 'antd';
import { Link } from 'react-router-dom';
import { fetchAllLeaves, fetchTodayLeaves } from '../../actions/leaves';
import { fetchTodayTrainings } from '../../actions/training';
import { fetchDeptUsers } from '../../actions/users';
import moment from 'moment';
import recharts, {
  BarChart,
  Bar,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  YAxis,
  XAxis,
  PieChart,
  Pie,
  LineChart,
  CartesianGrid,
  Line,
} from 'recharts';
import 'antd/dist/antd.css';
import PageLoading from '../PageLoading/PageLoading';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const { leaves, isLoading, todayLeaves } = useSelector(
    (state) => state.leaves
  );
  const { users } = useSelector((state) => state.users);
  const { trainings } = useSelector((state) => state.trainings);
  const dispatch = useDispatch();
  const history = useHistory();

  var pass2MonthC = 0,
    pass2MonthM = 0,
    pass1MonthC = 0,
    pass1MonthM = 0,
    currentMonthC = 0,
    currentMonthM = 0,
    next1MonthC = 0,
    next1MonthM = 0,
    next2MonthC = 0,
    next2MonthM = 0,
    next3MonthC = 0,
    next3MonthM = 0,
    max = 0;

  useEffect(() => {
    dispatch(fetchAllLeaves());
    dispatch(fetchTodayLeaves());
    dispatch(fetchTodayTrainings());
    dispatch(fetchDeptUsers(user.department._id));
    console.log(users);
  }, [dispatch]);

  const filterDept = todayLeaves.filter(
    (todayLeaves) => todayLeaves.department.name == user.department.name
  );

  const top3Users = users.slice(0, 3);

  var supervisorNames = [];
  users.map((element) => {
    if (element.roles.name == 'supervisor')
      supervisorNames.push(`${element.first_name} ${element.last_name}`);
  });

  console.log(supervisorNames);

  const leaveData = [
    { name: 'Casual', value: user.leaveCount.casual },
    { name: 'Medical', value: user.leaveCount.medical },
  ];

  //temp training data
  var totalTraining = 20,
    completedTraining = 15;
  var trainingNeeded = totalTraining - completedTraining;
  var completionPercentage = completedTraining / totalTraining;
  trainingNeeded = trainingNeeded < 0 ? 0 : trainingNeeded;

  const trainingData = [
    //test example data
    { name: 'Hours Completed', value: completedTraining },
    { name: 'Hours Required', value: trainingNeeded },
  ];

  leaves.map((element) => {
    var d = new Date(element.fromDate);
    if (
      element.status == 'approve' &&
      element.department.name == user.department.name
    ) {
      if (
        element.leaveType == 'casual' &&
        d.getMonth() == moment().subtract(2, 'months').month()
      )
        max = Math.max(++pass2MonthC, max);
      else if (
        element.leaveType == 'medical' &&
        d.getMonth() == moment().subtract(2, 'months').month()
      )
        max = Math.max(++pass2MonthM, max);
      else if (
        element.leaveType == 'casual' &&
        d.getMonth() == moment().subtract(1, 'months').month()
      )
        max = Math.max(++pass1MonthC, max);
      else if (
        element.leaveType == 'medical' &&
        d.getMonth() == moment().subtract(1, 'months').month()
      )
        max = Math.max(++pass1MonthM, max);
      else if (
        element.leaveType == 'casual' &&
        d.getMonth() == moment().month()
      )
        max = Math.max(++currentMonthC, max);
      else if (
        element.leaveType == 'medical' &&
        d.getMonth() == moment().month()
      )
        max = Math.max(++currentMonthM, max);
      else if (
        element.leaveType == 'casual' &&
        d.getMonth() == moment().add(1, 'months').month()
      )
        max = Math.max(++next1MonthC, max);
      else if (
        element.leaveType == 'medical' &&
        d.getMonth() == moment().add(1, 'months').month()
      )
        max = Math.max(++next1MonthM, max);
      else if (
        element.leaveType == 'casual' &&
        d.getMonth() == moment().add(2, 'months').month()
      )
        max = Math.max(++next2MonthC, max);
      else if (
        element.leaveType == 'medical' &&
        d.getMonth() == moment().add(2, 'months').month()
      )
        max = Math.max(++next2MonthM, max);
      else if (
        element.leaveType == 'casual' &&
        d.getMonth() == moment().add(3, 'months').month()
      )
        max = Math.max(++next3MonthC, max);
      else if (
        element.leaveType == 'medical' &&
        d.getMonth() == moment().add(3, 'months').month()
      )
        max = Math.max(++next3MonthM, max);
    }
  });

  const empLeaveData = [
    {
      name: moment().subtract(2, 'months').format('MMMM'),
      Casual: pass2MonthC,
      Medical: pass2MonthM,
    },
    {
      name: moment().subtract(1, 'months').format('MMMM'),
      Casual: pass1MonthC,
      Medical: pass1MonthM,
    },
    {
      name: moment().format('MMMM'),
      Casual: currentMonthC,
      Medical: currentMonthM,
    },
    {
      name: moment().add(1, 'months').format('MMMM'),
      Casual: next1MonthC,
      Medical: next1MonthM,
    },
    {
      name: moment().add(2, 'months').format('MMMM'),
      Casual: next2MonthC,
      Medical: next2MonthM,
    },
    {
      name: moment().add(3, 'months').format('MMMM'),
      Casual: next3MonthC,
      Medical: next3MonthM,
    },
  ];

  const COLORS1 = ['#0088FE', '#2ce654'];
  const COLORS2 = ['#0088FE', '#de0b0b'];

  const renderCustomizedLabel = ({ x, y, value }) => {
    return (
      <text x={x} y={y} fill='black' textAnchor='end' alignmentBaseline='auto'>
        {value}
      </text>
    );
  };
  if (isLoading) return <PageLoading />;

  return (
    <>
      <Typography.Title level={2}>Department Dashboard</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <Descriptions
              title='Department Details'
              bordered
              column={{ sm: 3, xs: 1 }}
            >
              <Descriptions.Item label='Name' span={2}>
                {user.department.name}
              </Descriptions.Item>
              <Descriptions.Item label='Code' span={1}>
                {user.department.code}
              </Descriptions.Item>
              <Descriptions.Item label='Supervisors' span={3}>
                <List
                  dataSource={supervisorNames}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text mark></Typography.Text> {item}
                    </List.Item>
                  )}
                />
              </Descriptions.Item>
              <Descriptions.Item label='No. of Staff' span={3}>
                {users.length}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <h4>Leaves Taken by Month for All Employees</h4>
            <ResponsiveContainer minHeight={300}>
              <LineChart
                width='100%'
                height='100%'
                data={empLeaveData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey='name' />
                <YAxis domain={[0, max + 2]} allowDecimals={false} />
                <Tooltip />
                <Legend wrapperStyle={{ top: 0, left: 70 }} />
                <Line
                  type='monotone'
                  dataKey='Casual'
                  stroke='#8884d8'
                  activeDot={{ r: 8 }}
                />
                <Line type='monotone' dataKey='Medical' stroke='#82ca9d' />
              </LineChart>
            </ResponsiveContainer>
            <Button type='primary'>
              <Link to='/leaves/list'>To Leaves</Link>
            </Button>
          </Card>
        </Col>
      </Row>
      <br />
      <Typography.Title level={2}>Department Overview</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Currently on Leave in Department:</b>
            {filterDept &&
              (!filterDept.length ? (
                <Empty></Empty>
              ) : (
                <>
                  <Table dataSource={filterDept} rowKey='_id'>
                    <Table.Column
                      title='Name'
                      dataIndex='name'
                      render={(text, record) => {
                        return `${record.user.first_name} ${record.user.last_name}`;
                      }}
                    ></Table.Column>
                    <Table.Column
                      title='Leave Type'
                      dataIndex='leaveType'
                      key='leaveType'
                      render={(text, record) => <Tag color='red'>{text}</Tag>}
                    ></Table.Column>
                    <Table.Column
                      title='Action'
                      key='action'
                      render={(text, record) => (
                        <Space size='middle' key={record._id}>
                          <Link to={`leaves/view/${record._id}`}>View</Link>
                        </Space>
                      )}
                    ></Table.Column>
                  </Table>
                </>
              ))}
          </Card>
        </Col>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Top Training Hours Completed:</b>
            {top3Users &&
              (!top3Users.length ? (
                <Empty></Empty>
              ) : (
                <>
                  <Table dataSource={top3Users} rowKey='_id'>
                    <Table.Column
                      title='Name'
                      dataIndex='name'
                      render={(text, record) => {
                        return `${record.first_name} ${record.last_name}`;
                      }}
                    ></Table.Column>
                    <Table.Column
                      title='Training Hours'
                      //dataIndex='leaveType'
                      //key='leaveType'
                      //render={(text, record) => <Tag color='red'>{text}</Tag>}
                    ></Table.Column>
                  </Table>
                </>
              ))}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;
