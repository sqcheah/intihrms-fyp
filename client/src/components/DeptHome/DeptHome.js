import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Table, Space, Button } from 'antd';
import 'antd/dist/antd.css';
import './DeptHome.css';
import { Link, useHistory } from 'react-router-dom';
import { deleteDept, getDepts } from '../../actions/depts';
const { Column } = Table;
const DeptHome = () => {
  const deleteD = (rec) => {
    // dispatch(deleteDept(rec._id));
  };
  const { depts } = useSelector((state) => state.depts);
  const dispatch = useDispatch();
  console.log(depts);
  useEffect(() => {
    dispatch(getDepts());
  }, [dispatch]);
  const history = useHistory();
  const createDept = () => {
    history.push('/depts/create');
  };
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={createDept}>Create New Department</Button>
      </Space>

      {!depts.length ? (
        <>
          <br />
          <Spin size='large' />
        </>
      ) : (
        <>
          <Table dataSource={depts} rowKey='_id'>
            <Column title='Code' dataIndex='code' key='code' />
            <Column title='Name' dataIndex='name' key='name' />
            <Column
              title='Action'
              key='action'
              render={(text, record) => (
                <Space size='middle'>
                  <Button danger onClick={() => deleteD(record)}>
                    Delete
                  </Button>
                </Space>
              )}
            />
          </Table>
          <Button>
            <Link to='/'>Back</Link>
          </Button>
        </>
      )}
    </>
  );
};

export default DeptHome;
