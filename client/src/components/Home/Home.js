import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from 'antd';
import { Link } from 'react-router-dom';
import { fetchAllLeaves, fetchTodayLeaves } from '../../actions/leaves';
import { fetchTodayTrainings } from '../../actions/training';
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
import './Home.less';
import PageLoading from '../PageLoading/PageLoading';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const { leaves, isLoading, todayLeaves } = useSelector(
    (state) => state.leaves
  );
  const { trainings } = useSelector((state) => state.trainings);
  const dispatch = useDispatch();
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
  }, [dispatch]);

  console.log(trainings);

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
      element.leaveType == 'casual' &&
      d.getMonth() == moment().subtract(2, 'months').month()
    )
      max = Math.max(++pass2MonthC, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'medical' &&
      d.getMonth() == moment().subtract(2, 'months').month()
    )
      max = Math.max(++pass2MonthM, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'casual' &&
      d.getMonth() == moment().subtract(1, 'months').month()
    )
      max = Math.max(++pass1MonthC, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'medical' &&
      d.getMonth() == moment().subtract(1, 'months').month()
    )
      max = Math.max(++pass1MonthM, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'casual' &&
      d.getMonth() == moment().month()
    )
      max = Math.max(++currentMonthC, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'medical' &&
      d.getMonth() == moment().month()
    )
      max = Math.max(++currentMonthM, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'casual' &&
      d.getMonth() == moment().add(1, 'months').month()
    )
      max = Math.max(++next1MonthC, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'medical' &&
      d.getMonth() == moment().add(1, 'months').month()
    )
      max = Math.max(++next1MonthM, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'casual' &&
      d.getMonth() == moment().add(2, 'months').month()
    )
      max = Math.max(++next2MonthC, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'medical' &&
      d.getMonth() == moment().add(2, 'months').month()
    )
      max = Math.max(++next2MonthM, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'casual' &&
      d.getMonth() == moment().add(3, 'months').month()
    )
      max = Math.max(++next3MonthC, max);
    else if (
      element.status == 'approve' &&
      element.leaveType == 'medical' &&
      d.getMonth() == moment().add(3, 'months').month()
    )
      max = Math.max(++next3MonthM, max);
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
  if (isLoading || !leaves || !todayLeaves || !trainings)
    return <PageLoading />;

  return (
    <>
      <Typography.Title level={2}>Personal Dashboard</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={12} lg={16}>
          <Card bordered>
            <Descriptions
              title='Profile Details'
              bordered
              column={{ sm: 2, xs: 1 }}
            >
              <Descriptions.Item label='Name' span={3}>
                {`${user.first_name} ${user.last_name}`}
              </Descriptions.Item>
              <Descriptions.Item label='Department' span={2}>
                {user.department.name}
              </Descriptions.Item>
              <Descriptions.Item label='Casual Leaves' span={1}>
                {user.leaveCount.casual}
              </Descriptions.Item>
              <Descriptions.Item label='Total Training Hours Required' span={1}>
                {totalTraining}
              </Descriptions.Item>
              <Descriptions.Item label='Medical Leaves' span={1}>
                {user.leaveCount.medical}
              </Descriptions.Item>
              <Descriptions.Item label='Training Hours Completed' span={1}>
                {completedTraining}
              </Descriptions.Item>
            </Descriptions>
            <br />
            {completionPercentage <= 0.25 ? (
              <Alert
                message='Low Training Hours Completed'
                description='Please participate in more trainings in order to reach your quota!'
                type='error'
              />
            ) : completionPercentage < 0.75 ? (
              <Alert
                message='Moderate Training Hours Completed'
                description='Keep up the good work! Participate in more trainings to reach your quota.'
                type='warning'
              />
            ) : completionPercentage < 1 ? (
              <Alert
                message='Great Training Hours Completed'
                description='Almost there! Keep participating in trainings to reach your quota!'
                type='success'
              />
            ) : (
              <Alert
                message='Training Quota Reached'
                description='Congratulations! You have reached your training quota!'
                type='success'
              />
            )}
          </Card>
        </Col>
        <Col className='gutter-row' xs={24} sm={12} lg={8}>
          <Card bordered>
            <h4>Your Leaves Remaining</h4>
            <ResponsiveContainer minHeight={180}>
              <BarChart
                data={leaveData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <Bar fill='#0088FE' dataKey='value'>
                  {leaveData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS1[index % COLORS1.length]}
                    />
                  ))}
                </Bar>
                <YAxis />
                <XAxis dataKey='name' />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
            <h4>Your Training Hours</h4>
            <ResponsiveContainer minWidth={200} minHeight={210}>
              <PieChart>
                <Pie
                  data={trainingData}
                  innerRadius={40}
                  outerRadius={60}
                  fill='#8884d8'
                  paddingAngle={3}
                  startAngle={-270}
                  dataKey='value'
                  isAnimationActive={false}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {trainingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS2[index % COLORS2.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <br />
      <Typography.Title level={2}>Today's Information</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Currently on Leave:</b>
            {todayLeaves &&
              (!todayLeaves.length ? (
                <Empty></Empty>
              ) : (
                <>
                  <Table dataSource={todayLeaves} rowKey='_id'>
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
            <Button type='danger'>
              <Link to='/leaves'>To Leaves</Link>
            </Button>
          </Card>
        </Col>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Internal Trainings Today:</b>
            {trainings &&
              (!trainings.length ? (
                <Empty></Empty>
              ) : (
                <>
                  <Table dataSource={trainings} rowKey='_id'>
                    <Table.Column
                      title='Organizer'
                      dataIndex='name'
                      render={(text, record) => {
                        return `${record.user.first_name} ${record.user.last_name}`;
                      }}
                    ></Table.Column>
                    <Table.Column
                      title='Tite'
                      dataIndex='title'
                      key='title'
                    ></Table.Column>
                    <Table.Column
                      title='Action'
                      key='action'
                      render={(text, record) => (
                        <Space size='middle' key={record._id}>
                          <Link to={`training/view/${record._id}`}>View</Link>
                        </Space>
                      )}
                    ></Table.Column>
                  </Table>
                </>
              ))}
            <Button type='danger'>
              <Link to='/training'>To Trainings</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;

/**<h4>Leaves Taken by Month for All Employees</h4>
            <ResponsiveContainer minHeight={425}>
              <LineChart
                width={500}
                height={300}
                data={empLeaveData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey='name' />
                <YAxis domain={[0, max + 2]} />
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
              <Link to='/calendar'>View on Calendar</Link>
            </Button> */
