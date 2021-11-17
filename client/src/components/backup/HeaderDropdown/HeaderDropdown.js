import { Dropdown } from 'antd';
import React from 'react';
import './HeaderDropdown.less';

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={`container ${cls}`} {...restProps} />
);

export default HeaderDropdown;
