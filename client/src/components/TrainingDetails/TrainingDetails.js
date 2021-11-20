import { StarOutlined } from '@ant-design/icons';
import { Badge, Button, Descriptions, List, Space, Upload } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTrainingById,
  leaveTraining,
  updateTraining,
  updateTrainingStatus,
} from '../../actions/training';
import PageLoading from '../PageLoading/PageLoading';
import './TrainingDetails.css';
const TrainingDetails = ({ socket, user }) => {
  const { isLoading, training } = useSelector((state) => state.trainings);
  //const user = JSON.parse(localStorage.getItem('profile')).result;

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    //used for approve/reject ext training
    dispatch(updateTrainingStatus(id, { ...training, status }));
  };

  const setAttendanceStatus = (attendant_id, newStatus) => {
    console.log(attendant_id, newStatus);
    const updatedAttendant = training.attendants.map((attendant) => {
      if (attendant.user._id === attendant_id)
        return { user: attendant_id, status: newStatus };
      return attendant;
    });

    dispatch(
      updateTrainingStatus(id, { ...training, attendants: updatedAttendant })
    );
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

  console.log(training);

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
        <Descriptions.Item label='Training Type' span={3}>
          {training.trainingType}
        </Descriptions.Item>
        <Descriptions.Item label='Organizer' span={3}>
          {training.organizer}
        </Descriptions.Item>
        <Descriptions.Item label='Start Date' span={2}>
          {moment(training.fromDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label='End Date' span={2}>
          {moment(training.toDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label='Time' span={3}>
          {`${training.fromTime} - ${training.toTime}`}
        </Descriptions.Item>
        {training.trainingType == 'internal' && (
          <Descriptions.Item label='Attendants' span={3}>
            {training.attendants.length != 0 ? (
              <>
                <List
                  size='small'
                  split='true'
                  dataSource={training.attendants}
                  renderItem={(item) => (
                    <List.Item>
                      <Space size='large'>
                        {`${item.user.first_name} ${item.user.last_name}`}
                        <Badge
                          status={
                            item.status == 'Pending'
                              ? 'processing'
                              : item.status == 'Approved'
                              ? 'success'
                              : 'error'
                          }
                          text={item.status}
                        />
                        {user.roles.name == 'admin' &&
                          item.status == 'Pending' && (
                            <>
                              <Button
                                className='btn-success'
                                onClick={() =>
                                  setAttendanceStatus(item.user._id, 'Approved')
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                danger
                                onClick={() =>
                                  setAttendanceStatus(item.user._id, 'Rejected')
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                      </Space>
                    </List.Item>
                  )}
                />
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
        <Button onClick={() => navigate(-1)}>Back</Button>
        {!training.attendants.some((e) => e.user._id === user._id) &&
        training.trainingType == 'internal' ? (
          <>
            <Button
              className='btn-success'
              onClick={() => joinTraining(user._id)}
            >
              Join Training
            </Button>
          </>
        ) : training.trainingType == 'internal' ? (
          <>
            <Button danger onClick={() => cancelAttendance(user._id)}>
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
