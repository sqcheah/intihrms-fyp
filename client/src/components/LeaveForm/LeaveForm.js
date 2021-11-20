import React, { createRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  Upload,
} from 'antd';
import 'antd/dist/antd.css';
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
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const LeaveForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('profile')).result;
  const { leave } = useSelector((state) => state.leaves);
  const { leaveTypes } = useSelector((state) => state.leaveTypes);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
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
    setError(null);

    let formData = new FormData();
    if (values.upload) {
      for (let file of values.upload) {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      }
    }

    const rangeValue = values['range-picker'];
    const startDate = rangeValue[0];
    const endDate = rangeValue[1];
    const type = leaveTypes.find((rec) => rec._id === values['leaveType']);
    let remainLeave = user.leaveCount[type['code']];
    const dateDiff = calcWorkingDays(startDate, endDate);

    const leaveData = {
      reason: values.reason,
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
        dispatch(updateLeave(id, formData));
      } else {
        dispatch(createLeave(formData));
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
      dispatch(fetchLeaveById(id)).then((leave) => {
        form.setFieldsValue({
          ...leave,
          'range-picker': [moment(leave.fromDate), moment(leave.toDate)],
        });
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
  return (
    <>
      <h2 className='form-header'>Apply for Leave</h2>
      <Form
        form={form}
        name='basic'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
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
            {leaveTypes.map((leaveType) => (
              <Option key={leaveType._id} value={leaveType._id}>
                {leaveType.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='Reason'
          name='reason'
          rules={[
            {
              required: true,
              message: 'Please input your reason!',
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
          <RangePicker />
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
