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
import { fetchAllLeaves, fetchLeaveCount } from '../../actions/leaves';
import { fetchTrainingCount } from '../../actions/training';
import { getUsers } from '../../actions/users';
import { getDepts } from '../../actions/depts';
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
  const { leaves, isLoading, leaveCount } = useSelector(
    (state) => state.leaves
  );
  const { users } = useSelector((state) => state.users);
  const { trainingCount } = useSelector((state) => state.trainings);
  const { depts } = useSelector((state) => state.depts);
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
    dispatch(fetchTrainingCount());
    dispatch(fetchLeaveCount());
    dispatch(getUsers());
    dispatch(getDepts());
  }, [dispatch]);

  const top3Users = users.slice(0, 3);

  leaves.map((element) => {
    var d = new Date(element.fromDate);
    if (element.status == 'approve') {
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
  if (isLoading || !leaves || !leaveCount) return <PageLoading />;
  return (
    <>
      <Typography.Title level={2}>Admin Dashboard</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={24}>
          <Card bordered>
            <h3>Leaves Taken by Month for All Employees</h3>
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
                  stroke='#0088FE'
                  activeDot={{ r: 8 }}
                />
                <Line type='monotone' dataKey='Medical' stroke='#2ce654' />
              </LineChart>
            </ResponsiveContainer>
            <br />
            <row>
              <Button className='right-button' type='primary'>
                <Link to='/leaves/list'>More Details...</Link>
              </Button>
              <Button className='right-button' type='primary'>
                <Link to='/calendar'>View on Calendar</Link>
              </Button>
            </row>
          </Card>
        </Col>
      </Row>
      <br />
      <Typography.Title level={2}>Overview</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Leaves Taken by Department:</b>
            <Table dataSource={leaveCount} rowKey='_id'>
              <Table.Column
                title='Name'
                dataIndex={['department', 'name']}
                dataKey={['department', 'name']}
              ></Table.Column>
              <Table.Column
                title='Leaves Taken'
                dataIndex='count'
                dataKey='count'
                defaultSortOrder='descend'
                sorter={(a, b) => a.count - b.count}
              ></Table.Column>
            </Table>
          </Card>
        </Col>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Trainings Conducted by Department:</b>
            <Table dataSource={trainingCount} rowKey='_id'>
              <Table.Column
                title='Name'
                dataIndex={['department', 'name']}
                dataKey={['department', 'name']}
              ></Table.Column>
              <Table.Column
                title='Trainings Organized'
                dataIndex='count'
                dataKey='count'
                defaultSortOrder='descend'
                sorter={(a, b) => a.count - b.count}
              ></Table.Column>
            </Table>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;
