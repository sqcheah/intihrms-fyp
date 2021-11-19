import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './Profile.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
  Descriptions,
  Badge,
  Button,
  Divider,
  Typography,
  Space,
  Upload,
  Image,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { getUser } from '../../actions/users';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
//https://github.com/nanxiaobei/antd-img-crop#styles
import 'antd/es/modal/style';
import 'antd/es/slider/style';
const { Text } = Typography;

const Profile = () => {
  const [imageState, setImageState] = useState({
    imageUrl:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    loading: false,
  });

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  const user = JSON.parse(localStorage.getItem('profile')).result;
  console.log('user', user);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleChange = (info) => {
    console.log(info, 'here');
    getBase64(info.fileList[0].originFileObj, (imageUrl) =>
      setImageState({
        imageUrl,
        loading: false,
      })
    );
    console.log(imageState);
    return;
    if (info.file.status === 'uploading') {
      setImageState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setImageState({
          imageUrl,
          loading: false,
        })
      );
    }
  };
  function ZoomIn() {
    return (
      <Image
        width={200}
        src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      />
    );
  }
  const uploadButton = (
    <div>
      {imageState.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const ImageCrop = () => (
    <ImgCrop rotate>
      <Upload
        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
        listType='picture-card'
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        customRequest={dummyRequest}
      >
        {fileList.length < 5 && '+ Upload'}
      </Upload>
    </ImgCrop>
  );
  const UploadProfile = () => (
    <ImgCrop rotate>
      <Upload
        name='avatar'
        listType='picture-card'
        className='avatar-uploader'
        showUploadList={false}
        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
        beforeUpload={preventUpload}
        // customRequest={dummyRequest}
        onChange={handleChange}
        accept='image/*'
      >
        {imageState.imageUrl ? (
          <img
            src={imageState.imageUrl}
            alt='avatar'
            style={{ width: '100%' }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );

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
      <Divider>
        <Text style={{ fontSize: 23 }}>Profile Page</Text>
      </Divider>
      <center>
        <div>
          <UploadProfile />
        </div>
      </center>

      <Descriptions
        title='Profile Details'
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label='Emoployee ID'>
          {user.emp_id}
        </Descriptions.Item>
        <Descriptions.Item label='First Name'>
          {user.first_name}
        </Descriptions.Item>
        <Descriptions.Item label='Last Name'>
          {user.last_name}
        </Descriptions.Item>
        <Descriptions.Item label='Department'>
          {user.department.name}
        </Descriptions.Item>
        <Descriptions.Item label='Employment Date'>
          {moment(user.employment_date).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label='Roles'>{user.roles.name}</Descriptions.Item>
      </Descriptions>
      <Descriptions title='Leave Balance' bordered>
        {Object.entries(user.leaveCount).map(([key, value]) => (
          <Descriptions.Item key={key} label={key}>
            {value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Button>
        <Link to='/'>Back to Home</Link>
      </Button>
    </>
  );
};
//https://flexiple.com/loop-through-object-javascript/

export default Profile;
