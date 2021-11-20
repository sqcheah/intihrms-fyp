import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests, fetchUpcomingLeaves } from '../../actions/leaves';
import {
  Spin,
  Table,
  Space,
  Button,
  Badge,
  Empty,
  Tag,
  Row,
  Col,
  Card,
  Typography,
  Descriptions,
} from 'antd';

import { Link, useNavigate } from 'react-router-dom';
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
} from 'recharts';
import 'antd/dist/antd.css';
import './LeaveHome.css';
import { set } from 'lodash';
import PageLoading from '../PageLoading/PageLoading';
const { Text } = Typography;

const LeaveHome = () => {
  const [loading, setLoading] = useState(true);
  const { leaves, upcomingLeave, isLoading } = useSelector(
    (state) => state.leaves
  );
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  var count = 0;

  const data = [
    { name: 'Casual', value: user.leaveCount.casual },
    { name: 'Medical', value: user.leaveCount.medical },
  ];
  const COLORS = ['#0088FE', '#2ce654'];

  useEffect(() => {
    dispatch(fetchUpcomingLeaves(user._id));
    if (user.roles.name != 'staff')
      dispatch(
        fetchLeaveRequests(user.roles.name, user._id, user.department.name)
      );

    console.log(user);
  }, [dispatch]);

  for (var element of leaves) {
    if (element.status == 'pending') count++;
  }

  if (isLoading) return <PageLoading />;
  return (
    <>
      <Typography.Title level={2}>Current Leave Status</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} md={12} lg={16}>
          <Card bordered>
            <Descriptions
              title='Profile Details'
              bordered
              column={{ sm: 2, xs: 1 }}
            >
              <Descriptions.Item label='Name' span={2}>
                {`${user.first_name} ${user.last_name}`}
              </Descriptions.Item>
              <Descriptions.Item label='Department' span={2}>
                {user.department.name}
              </Descriptions.Item>
              <Descriptions.Item label='Casual Leaves' span={1}>
                {user.leaveCount.casual}
              </Descriptions.Item>
              <Descriptions.Item label='Medical Leaves' span={1}>
                {user.leaveCount.medical}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col className='gutter-row' xs={24} md={12} lg={8}>
          <Card bordered>
            <ResponsiveContainer minHeight={215}>
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <Bar fill='#0088FE' dataKey='value'>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
                <YAxis />
                <XAxis dataKey='name' />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <br />
      <Typography.Title level={2}>Quick Overview</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Upcoming Leaves:</b>
            {upcomingLeave &&
              (!upcomingLeave.length ? (
                <Empty></Empty>
              ) : (
                <>
                  <Table dataSource={upcomingLeave} rowKey='_id'>
                    <Table.Column
                      title='Leave Type'
                      dataIndex='leaveType'
                      key='leaveType'
                      render={(text, record) => (
                        <Tag color={text.color}>{text.name}</Tag>
                      )}
                    ></Table.Column>
                    <Table.Column
                      title='Reason'
                      dataIndex='reason'
                      key='reason'
                      render={(text, record) => <Text ellipsis>{text}</Text>}
                    ></Table.Column>
                    <Table.Column
                      title='Date'
                      dataIndex='date'
                      key='date'
                      render={(text, record) =>
                        moment(text).format('YYYY-MM-DD')
                      }
                    ></Table.Column>
                  </Table>
                </>
              ))}
            <br />
            <Space>
              <Button type='danger'>
                <Link to='/leaves/create'>Apply Leave</Link>
              </Button>
              <Button type='danger'>
                <Link to='/leaves/history'>Leave History</Link>
              </Button>
            </Space>
          </Card>
        </Col>
        {user.roles.name != 'staff' && (
          <Col className='gutter-row' xs={24} sm={12}>
            <Card bordered>
              Pending Leave Requests:{` ${count}`}
              <Button className='right-button' type='danger'>
                <Link to='/leaves/list'>To Requests</Link>
              </Button>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default LeaveHome;
