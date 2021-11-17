import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import './TrainingDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
  fetchTrainingById,
  updateTraining,
  leaveTraining,
  updateTrainingStatus,
} from '../../actions/training';
import { Descriptions, Badge, Button, Space, Upload, Spin } from 'antd';
import { UploadOutlined, InboxOutlined, StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { updateUser } from '../../actions/users';
import PageLoading from '../PageLoading/PageLoading';
const TrainingDetails = () => {
  const { isLoading, training } = useSelector((state) => state.trainings);
  const user = JSON.parse(localStorage.getItem('profile')).result;

  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchTrainingById(id));
  }, [id]);

  const joinTraining = (user_id) => {
    dispatch(updateTraining(id, { user_id }));
  };

  const cancelAttendance = (user_id) => {
    dispatch(leaveTraining(id, { user_id }));
  };

  const setStatus = (status) => {
    dispatch(updateTrainingStatus(id, { ...training, status }));
  };

  const defaultFile = () => {
    if (!!!id) return null;
    console.log(training);
    return (
      training?.attachments?.map((file) => {
        return {
          uid: file.fileId,
          name: file.fileName,
          status: 'done',
          url: `http://localhost:5000/${file.filePath}`,
        };
      }) || []
    );
  };

  if (!training) return null;
  if (isLoading) return <PageLoading />;
  return (
    <>
      <Descriptions
        style={{ marginBottom: 16 }}
        title='Training Info'
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        {training.trainingType == 'external' && (
          <Descriptions.Item label='Requester' span={3}>
            {`${training.user.first_name} ${training.user.last_name}`}
          </Descriptions.Item>
        )}
        <Descriptions.Item label='Title' span={3}>
          {training.title}
        </Descriptions.Item>
        <Descriptions.Item label='Description' span={3}>
          {training.description}
        </Descriptions.Item>
        <Descriptions.Item label='Organizer' span={3}>
          {training.trainingType == 'internal' ? (
            <>{`${training.user.first_name} ${training.user.last_name}`}</>
          ) : (
            <>{`${training.organization}`}</>
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Date' span={1}>
          {moment(training.date).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label='Time' span={2}>
          {training.time}
        </Descriptions.Item>
        {training.trainingType == 'internal' && (
          <Descriptions.Item label='Attendants' span={3}>
            {training.attendants.length != 0 ? (
              <>
                {training.attendants.map((item) => (
                  <div key={item._id}>
                    {`${item.first_name} ${item.last_name}`}
                  </div>
                ))}
              </>
            ) : (
              <div>No data</div>
            )}
          </Descriptions.Item>
        )}
        <Descriptions.Item label='Supporting Documents' span={3}>
          {training.attachments.length != 0 ? (
            <>
              <Upload
                className='showFiles'
                defaultFileList={defaultFile}
                showUploadList={{
                  showDownloadIcon: true,
                  downloadIcon: (
                    <StarOutlined
                    //onClick={(e) => console.log(e, 'custom removeIcon event')}
                    />
                  ),
                  showRemoveIcon: false,
                }}
              ></Upload>
            </>
          ) : (
            <div>None</div>
          )}
        </Descriptions.Item>
        {training.trainingType == 'external' && (
          <Descriptions.Item label='Status' span={3}>
            <Badge
              status={
                training.status == 'pending'
                  ? 'processing'
                  : training.status == 'approve'
                  ? 'success'
                  : 'error'
              }
              text={training.status}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
      <Space>
        <Button onClick={() => history.goBack()}>Back</Button>
        {training.user._id != user._id &&
        !training.attendants.some((e) => e._id === user._id) &&
        training.trainingType == 'internal' ? (
          <>
            <Button
              className='btn-success'
              onClick={() => joinTraining(user._id)}
            >
              Join Training
            </Button>
          </>
        ) : training.user._id != user._id &&
          training.trainingType == 'internal' ? (
          <>
            <Button
              className='btn-success'
              onClick={() => cancelAttendance(user._id)}
            >
              Cancel Attendance
            </Button>
          </>
        ) : (
          training.user._id != user._id &&
          training.trainingType == 'external' &&
          training.status == 'pending' && (
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
          )
        )}
      </Space>
    </>
  );
};

export default TrainingDetails;
