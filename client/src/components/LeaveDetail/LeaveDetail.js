import React, { useEffect, useState } from 'react';

import './LeaveDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveById, updateLeave } from '../../actions/leaves';
import { Descriptions, Badge, Button, Space, Spin, Tag, Upload } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { updateUser, getUser } from '../../actions/users';
import PageLoading from '../PageLoading/PageLoading';
import _ from 'lodash';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const LeaveDetail = ({ user: curUser }) => {
  const screens = useBreakpoint();
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
    if (status == 'Approved') {
      dispatch(getUser(leave.user._id)).then((user) => {
        console.log(user);
        const { count: remainLeave } = user.leaveCount.find(
          (l) => l.leaveType._id == leave.leaveType._id
        );

        const dateDiff =
          moment
            .duration(moment(leave.toDate).diff(moment(leave.fromDate)))
            .asDays() + 1;
        const minDate = remainLeave - dateDiff;
        const newLeaveCount = user.leaveCount.map((l) =>
          l.leaveType._id == leave.leaveType._id ? { ...l, count: minDate } : l
        );
        dispatch(
          updateUser(user._id, {
            leaveCount: newLeaveCount,
          })
        );
      });
    }
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const defaultFile = () => {
    if (!!!id) return null;

    return (
      leave?.attachments?.map((file) => {
        return {
          uid: file.fileId,
          name: file.fileName,
          status: 'done',
          url: `http://localhost:5000/${file.filePath}`,
        };
      }) || []
    );
  };
  if (loading || leaveIsloading) return <PageLoading />;
  //if (leaveIsloading || userIsloading) return null;
  return (
    <>
      <Descriptions
        title='Leave Info'
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        layout={screens.md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label='Requester' span={3}>
          {`${leave.user.first_name} ${leave.user.last_name}`}
        </Descriptions.Item>
        <Descriptions.Item label='Department' span={3}>
          {leave.department.name}
        </Descriptions.Item>
        <Descriptions.Item label='Leave Type' span={3}>
          {
            <Tag color={leave.leaveType.color}>
              {capitalizeFirstLetter(leave.leaveType.code)}
            </Tag>
          }
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

        <Descriptions.Item label='Supporting Documents' span={3}>
          {leave.attachments.length != 0 ? (
            <>
              <Upload
                className='showFiles'
                defaultFileList={defaultFile}
                showUploadList={{
                  showDownloadIcon: true,

                  showRemoveIcon: false,
                }}
              ></Upload>
            </>
          ) : (
            <div>None</div>
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Status' span={3}>
          <Badge
            status={
              leave.status == 'Pending'
                ? 'processing'
                : leave.status == 'Approved'
                ? 'success'
                : 'error'
            }
            text={leave.status}
          />
        </Descriptions.Item>
      </Descriptions>
      <Space size='middle'>
        <Button onClick={() => navigate(-1)}>Back</Button>
        {leave.status == 'Pending' && leave.user._id == curUser._id ? (
          <>
            <Button
              className='btn-success'
              onClick={() => setStatus('Cancelled')}
            >
              Cancel
            </Button>
          </>
        ) : (
          leave.user._id != curUser._id &&
          leave.status == 'Pending' && (
            <>
              <Button
                className='btn-success'
                onClick={() => setStatus('Approved')}
              >
                Approve
              </Button>
              <Button danger onClick={() => setStatus('Rejected')}>
                Reject
              </Button>
            </>
          )
        )}
      </Space>
    </>
  );
};

export default LeaveDetail;
