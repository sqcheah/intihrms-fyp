import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './LeaveDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveById, updateLeave } from '../../actions/leaves';
import { Descriptions, Badge, Button, Space, Spin } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { updateUser, getUser } from '../../actions/users';
import PageLoading from '../PageLoading/PageLoading';
import _ from 'lodash';
const LeaveDetail = () => {
  const { leave, isLoading: leaveIsloading } = useSelector(
    (state) => state.leaves
  );
  const dispatch = useDispatch();
  const [loading, setIsloading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchLeaveById(id)).then(() => setIsloading(false));
  }, [dispatch, id]);
  const setStatus = (status) => {
    dispatch(updateLeave(id, { ...leave, status }));
    if (status == 'approve') {
      dispatch(getUser(leave.user._id)).then((user) => {
        console.log(user);
        const remainLeave = user.leaveCount[leave.leaveType];
        const dateDiff =
          moment
            .duration(moment(leave.toDate).diff(moment(leave.fromDate)))
            .asDays() + 1;
        const minDate = remainLeave - dateDiff;
        dispatch(
          updateUser(user._id, {
            ...user,
            leaveCount: {
              ...user.leaveCount,
              [leave.leaveType]: minDate,
            },
          })
        );
      });
    }
  };

  if (loading || leaveIsloading) return <PageLoading />;
  //if (leaveIsloading || userIsloading) return null;
  return (
    <>
      <Descriptions
        title='Leave Info'
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label='Requester' span={3}>
          {`${leave.user.first_name} ${leave.user.last_name}`}
        </Descriptions.Item>
        <Descriptions.Item label='Department' span={3}>
          {leave.department.name}
        </Descriptions.Item>
        <Descriptions.Item label='Title' span={3}>
          {leave.title}
        </Descriptions.Item>
        <Descriptions.Item label='Reason' span={3}>
          {leave.reason}
        </Descriptions.Item>
        <Descriptions.Item label='Start Date' span={1}>
          {moment(leave.fromDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label='End Date' span={2}>
          {moment(leave.toDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label='Status' span={3}>
          <Badge
            status={
              leave.status == 'pending'
                ? 'processing'
                : leave.status == 'approve'
                ? 'success'
                : 'error'
            }
            text={leave.status}
          />
        </Descriptions.Item>
      </Descriptions>
      <Space>
        <Button onClick={() => navigate(-1)}>Back</Button>
        {leave.status == 'pending' && (
          <>
            <Button
              className='btn-success'
              onClick={() => setStatus('approve')}
            >
              Approve
            </Button>
            <Button danger onClick={() => setStatus('reject')}>
              Reject
            </Button>
          </>
        )}
      </Space>
    </>
  );
};

export default LeaveDetail;
