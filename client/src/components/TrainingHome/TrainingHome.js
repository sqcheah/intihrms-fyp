import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExtTraining,
  fetchUpcomingTraining,
} from '../../actions/training';
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

import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import recharts, {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import 'antd/dist/antd.css';
import './TrainingHome.css';
import { set } from 'lodash';
import PageLoading from '../PageLoading/PageLoading';

const TrainingHome = () => {
  const [loading, setLoading] = useState(true);
  const { trainings, upcomingTraining, isLoading } = useSelector(
    (state) => state.trainings
  );
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const history = useHistory();
  const dispatch = useDispatch();
  var count = 0;

  const data = [
    //test example data
    { name: 'Hours Completed', value: 15 },
    { name: 'Hours Required', value: 5 },
  ];
  const COLORS = ['#0088FE', '#de0b0b'];

  const renderCustomizedLabel = ({ x, y, value }) => {
    return (
      <text x={x} y={y} fill='black' textAnchor='end' alignmentBaseline='auto'>
        {value}
      </text>
    );
  };

  useEffect(() => {
    console.log(user);
    dispatch(fetchUpcomingTraining(user._id));
    if (user.roles.name != 'staff')
      dispatch(
        fetchExtTraining(user.roles.name, user._id, user.department.name)
      );
  }, [dispatch]);

  for (var element of trainings) {
    if (element.status == 'pending') count++;
  }

  console.log('trainings', trainings);
  console.log('upcoming', upcomingTraining);
  if (isLoading) return <PageLoading />;
  return (
    <>
      <Typography.Title level={2}>Current Training Status</Typography.Title>
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
              <Descriptions.Item label='Total Training Hours Required' span={1}>
                {20 /**temp data */}
              </Descriptions.Item>
              <Descriptions.Item label='Training Hours Completed' span={1}>
                {15 /**temp data */}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col className='gutter-row' xs={24} md={12} lg={8}>
          <Card bordered>
            <ResponsiveContainer minWidth={200} minHeight={200}>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  fill='#8884d8'
                  paddingAngle={3}
                  startAngle={-270}
                  dataKey='value'
                  isAnimationActive={false}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
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
      <Typography.Title level={2}>Quick Overview</Typography.Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row' xs={24} sm={12}>
          <Card bordered>
            <b>Upcoming Trainings:</b>
            {upcomingTraining && // uh just do the ?.ya better
              (!upcomingTraining.length ? (
                <Empty></Empty>
              ) : (
                <>
                  <Table dataSource={upcomingTraining} rowKey='_id'>
                    <Table.Column
                      title='Organizer'
                      render={(text, record) => {
                        return record.trainingType == 'internal'
                          ? `${record.user.first_name} ${record.user.last_name}`
                          : `${record.organization}`;
                      }}
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
                      render={(text, record) =>
                        moment(text).format('YYYY-MM-DD')
                      }
                    ></Table.Column>
                  </Table>
                </>
              ))}
            <Button type='danger'>
              <Link to='/training/history'>To Trainings</Link>
            </Button>
          </Card>
        </Col>
        {user.roles.name != 'staff' && (
          <Col className='gutter-row' xs={24} sm={12}>
            <Card bordered>
              Pending External Training Requests:{` ${count}`}
              <Button className='right-button' type='danger'>
                <Link to='/training/extList'>To Requests</Link>
              </Button>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default TrainingHome;
