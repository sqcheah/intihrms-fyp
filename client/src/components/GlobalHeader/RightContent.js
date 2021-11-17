import { Tooltip, Tag, Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIcon from './NoticeIconView';

const GlobalHeaderRight = () => {
  const theme = 'light';
  const layout = 'top';
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <Space>
        <NoticeIcon />
        <Tooltip title='使用文档'>
          <a
            style={{
              color: 'inherit',
            }}
            target='_blank'
            href='https://pro.ant.design/docs/getting-started'
            rel='noopener noreferrer'
            className={styles.action}
          >
            <QuestionCircleOutlined />
          </a>
        </Tooltip>
        <Avatar />
      </Space>
    </div>
  );
};

export default GlobalHeaderRight;
