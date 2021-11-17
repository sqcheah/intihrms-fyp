import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Table, Space, Button, List, Grid } from 'antd';
import 'antd/dist/antd.css';
import './StaffHome.css';
import { Link, useHistory } from 'react-router-dom';
import { getUsers } from '../../actions/users';
const { Column } = Table;
const { useBreakpoint } = Grid;
const StaffHome = () => {
  const { users, isLoading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  const history = useHistory();
  const createUser = () => {
    history.push('/users/create');
  };
  const screens = useBreakpoint();
  if (isLoading) return <Spin size='large' />;
  console.log(users);
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={createUser}>Add User</Button>
      </Space>
      <br />
      {isLoading ? (
        <>
          <Spin size='large' />
        </>
      ) : (
        [
          screens.xs ? (
            <List
              itemLayout='vertical'
              size='large'
              dataSource={users}
              renderItem={(item) => (
                <List.Item
                  key={item._id}
                  actions={[
                    <Button>
                      <Link to={`users/view/${item._id}`}>View</Link>
                    </Button>,
                  ]}
                >
                  <List.Item.Meta title={item.emp_id} />
                  {item.first_name} {item.last_name}
                </List.Item>
              )}
            />
          ) : (
            <>
              <Table dataSource={users} rowKey='_id'>
                <Column title='Employee ID' dataIndex='emp_id' key='emp_id' />
                <Column
                  title='Name'
                  key='name'
                  render={(text, record) => (
                    <div>
                      {record.first_name} {record.last_name}
                    </div>
                  )}
                />
                <Column
                  title='Department'
                  dataIndex={['department', 'name']}
                  key='department.name'
                />
                <Column
                  title='Roles'
                  dataIndex={['roles', 'name']}
                  key='roles.name'
                />
                <Column
                  title='Action'
                  key='action'
                  render={(text, record) => (
                    <Space size='middle'>
                      <Button>
                        <Link to={`users/view/${record._id}`}>View</Link>
                      </Button>
                    </Space>
                  )}
                />
              </Table>
              <Button>
                <Link to='/'>Back</Link>
              </Button>
            </>
          ),
        ]
      )}
    </>
  );
};

export default StaffHome;
