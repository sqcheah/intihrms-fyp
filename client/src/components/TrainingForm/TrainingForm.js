import React, { createRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Typography,
  Upload,
} from 'antd';
import 'antd/dist/antd.css';

import { useDispatch, useSelector } from 'react-redux';
import { createTraining } from '../../actions/training';
import { Link, useParams } from 'react-router-dom';
import {
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import './TrainingForm.css';
import PageLoading from '../PageLoading/PageLoading';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const TrainingForm = () => {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem('profile')).result;
  const { isLoading, training } = useSelector((state) => state.trainings);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
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

    const trainingData = {
      user: user._id,
      department: user.department._id,
      title: values.title,
      description: values.description,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm'),
      duration: values.duration,
      trainingType: 'internal',
    };
    Object.entries(trainingData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    dispatch(createTraining(formData));
  };
  const defaultFile = () => {
    if (!!!id) return null;
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

  //if (isLoading) return <PageLoading />;

  return (
    <>
      <h2 className='form-header'>Organize Internal Training</h2>
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
          label='Title'
          name='title'
          rules={[
            {
              required: true,
              message: 'Please insert a title!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          rules={[
            {
              required: true,
              message: 'Please input your training description!',
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label='Date'
          name='date'
          rules={[
            {
              required: true,
              message: 'Please input your date!',
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label='Time'
          name='time'
          rules={[
            {
              required: true,
              message: 'Please input your time!',
            },
          ]}
        >
          <TimePicker />
        </Form.Item>

        <Form.Item
          label='Duration(hours)'
          name='duration'
          rules={[
            {
              required: true,
              message: 'Please input the duration!',
            },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        {/**https://github.com/ant-design/ant-design/tree/master/components/upload/UploadList */}
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
          <Button type='secondary' htmlType='button'>
            <Link to='/training/list'>Back</Link>
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default TrainingForm;
