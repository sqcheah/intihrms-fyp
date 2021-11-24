import React, { createRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  Upload,
  Modal,
} from 'antd';

import './LeaveForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { createLeave, fetchLeaveById, updateLeave } from '../../actions/leaves';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getLeaveTypes } from '../../actions/leaveTypes';
import {
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { PageLoading } from '@ant-design/pro-layout';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const LeaveForm = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { leave } = useSelector((state) => state.leaves);
  const [showRange, setShowRange] = useState(false);
  const { leaveTypes } = useSelector((state) => state.leaveTypes);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const calcWorkingDays = (startDate, endDate) => {
    let day = moment(startDate);
    let workingDays = 0;
    ///https://stackoverflow.com/a/45483646
    while (day.isSameOrBefore(endDate, 'day')) {
      if (![0, 6].includes(day.day())) workingDays++;
      day.add(1, 'd');
    }
    return workingDays;
  };
  const onFinish = (values) => {
    let existedFile = [];
    setError(null);
    console.log(values);
    let formData = new FormData();
    if (values.upload) {
      for (let file of values.upload) {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        } else {
          existedFile.push(leave.attachments.find((a) => a.fileId == file.uid));
        }
      }
    } else {
      if (id) {
        existedFile = leave.attachments;
      }
    }

    const rangeValue = values['range-picker'];
    const startDate = rangeValue[0];
    const endDate = rangeValue[1];
    const type = leaveTypes.find((rec) => rec._id === values['leaveType']);
    console.log(user.leaveCount);
    user.leaveCount.forEach((l) => console.log(l.leaveType));
    let { count: remainLeave } = user.leaveCount.find(
      (l) => l.leaveType._id == values['leaveType']
    );
    console.log(remainLeave);
    const dateDiff = calcWorkingDays(startDate, endDate);

    const leaveData = {
      user_name: `${user.first_name} ${user.last_name}`,
      reason: values.reason || '',
      leaveType: values.leaveType,
      user: user._id,
      department: user.department._id,
      fromDate: startDate.format('YYYY-MM-DD HH:mm'),
      toDate: endDate.format('YYYY-MM-DD HH:mm'),
    };
    Object.entries(leaveData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    //  console.log(...formData);
    console.log(remainLeave);
    if (remainLeave >= dateDiff) {
      if (id) {
        formData.append('attachments', JSON.stringify(existedFile));
        dispatch(updateLeave(id, formData));
        Modal.success({
          content: 'Changes saved.',
          onOk() {
            navigate('/leaves/home');
          },
        });
      } else {
        dispatch(createLeave(formData));
        Modal.success({
          content: 'Leave application submitted.',
          onOk() {
            navigate('/leaves/home');
          },
        });
      }
    } else {
      setError('Insufficient leave balance');
    }
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
  useEffect(() => {
    dispatch(getLeaveTypes());
    console.log(leaveTypes);
    if (id) {
      setLoading(true);
      dispatch(fetchLeaveById(id)).then((leave) => {
        form.setFieldsValue({
          reason: leave.reason || '',
          leaveType: leave.leaveType._id,
          'range-picker': [moment(leave.fromDate), moment(leave.toDate)],
        });
        setLoading(false);
      });
    }
  }, [dispatch, id]);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const preventUpload = (file) => {
    console.log('?????false', file);
    return false;
  };
  //https://stackoverflow.com/a/51519603/4858751
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };
  const disabledDate = (val) => {
    console.log(val.format('YYYY-MM-DD'));
    const ltVal = form.getFieldValue('leaveType');

    if (!ltVal) return true;
    const lt = leaveTypes.find((l) => l._id == ltVal);
    const ltStart = lt.startDate;
    const ltEnd = lt.endDate;
    let start, end;
    if (ltStart == 'year' || ltStart == 'month') {
      start = moment().startOf(ltStart);
    } else {
      console.log(ltStart);
      const operator = ltStart.charAt(0);
      const day = parseInt(ltStart.substring(1));
      if (operator == '+') {
        start = moment().add(day, 'days');
      } else {
        start = moment().subtract(day, 'days');
      }
    }

    if (ltEnd == 'year' || ltEnd == 'month') {
      end = moment().endOf(ltEnd);
    } else {
      const operator = ltEnd.charAt(0);
      const day = parseInt(ltEnd.substring(1));
      if (operator == '+') {
        end = moment().add(day, 'days');
      } else {
        end = moment().subtract(day, 'days');
      }
    }
    console.log(end.format('YYYY-MM-DD'), start.format('YYYY-MM-DD'));
    return val < start || val > end;
  };

  if (loading) return <PageLoading />;
  return (
    <>
      <h2 className='form-header'>{id ? 'Edit Leave' : 'Apply for Leave'}</h2>
      <Form
        form={form}
        name='basic'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Leave Type'
          name='leaveType'
          rules={[
            {
              required: false,
              message: 'Please input your leaveType!',
            },
          ]}
        >
          <Select>
            {user.leaveCount.map((leave) => (
              <Option key={leave.leaveType._id} value={leave.leaveType._id}>
                {leave.leaveType.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='Reason'
          name='reason'
          rules={[
            {
              whitespace: true,
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label='Date'
          name='range-picker'
          rules={[
            {
              required: true,
              message: 'Please input your date!',
            },
          ]}
        >
          <RangePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item
          name='upload'
          label='Supporting Documents'
          valuePropName='fileList'
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            name='logo'
            listType='picture'
            beforeUpload={preventUpload}
            customRequest={dummyRequest}
            defaultFileList={defaultFile}
            showUploadList={{
              showDownloadIcon: true,
              downloadIcon: (file) => {
                if (file.status == 'done') return <DownloadOutlined />;
                return <></>;
              },
              showRemoveIcon: true,
              removeIcon: (file) => {
                if (file.status == 'done') return <></>;
                return <DeleteOutlined />;
              },
            }}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          {error && <Text type='danger'>{error}</Text>}
          <br />
          <br />
          <br />
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
          <Button
            type='secondary'
            htmlType='button'
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default LeaveForm;
