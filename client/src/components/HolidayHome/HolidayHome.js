import { Typography, DatePicker, Button, Table, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidaysByYear } from '../../actions/holidays';
import { Link } from 'react-router-dom';
const HolidayHome = ({ socket, user }) => {
  const { holidays } = useSelector((state) => state.holidays);
  const today = moment();
  const dispatch = useDispatch();
  const [year, setYear] = useState(today.year().toString());
  const onChange = (date, dateStr) => {
    setYear(dateStr);
  };
  useEffect(() => {
    dispatch(fetchHolidaysByYear(year));
  }, [dispatch, year]);

  const testNoti = () => {
    console.log(user);
    socket?.emit('sendNoti', {
      senderName: user.email,
      receiverName: 'ShamsuzlynnMahat244@gmail.com',
      content: 'test',
    });
  };

  return (
    <>
      <Typography.Title level={1}>Holidays</Typography.Title>
      <DatePicker onChange={onChange} picker='year' defaultValue={today} />
      <Button>
        <Link to={`/holidays/create/${year}`}>Add New Holiday</Link>
      </Button>
      {holidays?.lists?.length ? (
        <>
          <Table
            dataSource={holidays.lists}
            rowKey='_id'
            style={{ 'overflow-x': 'scroll' }}
          >
            <Table.Column
              title='Title'
              dataIndex='title'
              key='title'
            ></Table.Column>
            <Table.Column
              title='Start Date'
              dataIndex='startDate'
              key='startDate'
              render={(text, record) => moment(text).format('YYYY-MM-DD')}
            ></Table.Column>
            <Table.Column
              title='End Date'
              dataIndex='endDate'
              key='endDate'
              render={(text, record) => moment(text).format('YYYY-MM-DD')}
            ></Table.Column>
          </Table>
        </>
      ) : (
        <Empty />
      )}
      <Button>
        <Link to='/'>Back</Link>
      </Button>
      <Button onClick={testNoti}>Test</Button>
    </>
  );
};

export default HolidayHome;
