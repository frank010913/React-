import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Form, Input, Row, Select, DatePicker, Table, Tag, Modal, Space, Drawer, Radio, message, Dropdown, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, ExclamationCircleFilled, createFromIconfontCN } from '@ant-design/icons';
import moment from 'moment';
import { userList, addUser, delUser, updateUser, reset, excel } from '../../../apis/ums';
import { Link } from 'react-router-dom';
const { Option } = Select;
const { confirm } = Modal;
export default function User() {
  const [addAndUpdate, setAddAndUpdate] = useState(false);
  const [pageNumber, setPageNumber] = useState('');
  const username = useRef();
  const password = useRef();
  const email = useRef();
  const mobile = useRef();
  const [roleValue, setRoleValue] = useState([]);
  const [Page, updatePage] = useState(0);
  const [deptValue, setDeptValue] = useState('');
  const [getOptions, setGetOptions] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [ssexValue, setSsexValue] = useState('');
  const [searchInfor, setSearchInfor] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const [userDataList, setUserDataList] = useState([]);
  const [total, setTotal] = React.useState(0);
  const { RangePicker } = DatePicker;
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();
  const [openDrawer, setOpenDrawer] = useState(false);
  const IconFont = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/c/font_3835532_c4tmklw5son.js',
    ],
  });
  const showDrawer = () => {
    setSearchInfor('');
    setOpenDrawer(true);
    setAddAndUpdate(false);
    updatePage(e => e + 1);
  };
  const onClose = () => {
    setOpenDrawer(false);
    updatePage(false);
  };

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    // console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  // const clearFilters = () => {
  //   setFilteredInfo({});
  // };
  // const clearAll = () => {
  //   setFilteredInfo({});
  //   setSortedInfo({});
  // };
  // const setAgeSort = () => {
  //   setSortedInfo({
  //     order: 'descend',
  //     columnKey: 'age',
  //   });
  // };
  const columns = [
    {
      title: '?????????',
      dataIndex: 'username',
      defaultSortOrder: '',
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: '??????',
      dataIndex: 'ssex',
      filters: [
        {
          text: '???',
          value: '0',
        },
        {
          text: '???',
          value: '1',
        },
        {
          text: '??????',
          value: '2',
        },
      ],
      filteredValue: filteredInfo.ssex || null,
      onFilter: (value, record) => record.ssex === value,
      render: (ssex) => {
        if (ssex == '0') {
          ssex = '???'
        } else if (ssex == '1') {
          ssex = '???'
        } else {
          ssex = '??????'
        }
        return ssex;
      }
    },
    {
      title: '??????',
      dataIndex: 'email',
    },
    {
      title: '??????',
      dataIndex: 'deptName',
    },
    {
      title: '??????',
      dataIndex: 'mobile',
    },
    {
      title: '??????',
      dataIndex: 'status',
      render: (status) => {
        if (status == '1') {
          status = '??????'
        } else {
          status = '??????'
        }
        return (
          <Tag color={status == '??????' ? 'green' : 'red'} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        {
          text: '??????',
          value: '0',
        },
        {
          text: '??????',
          value: '1',
        }
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      defaultSortOrder: '',
      sorter: (a, b) => Date.parse(a.createTime) - Date.parse(b.createTime),
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '??????',
      render: (item) => <div><Space onClick={() => update(item.userId)} style={{ cursor: 'pointer' }}>
        <IconFont type="icon-setting" />
      </Space>&nbsp;&nbsp;&nbsp;<Space onClick={() => showModal(item.userId)} style={{ cursor: 'pointer' }}>
          <IconFont type="icon-yanjing-" />
        </Space></div>
    },
  ];
  useEffect(() => {
    getList(10, (pageNumber || 1));
    form.setFieldsValue(searchInfor);
  }, [searchInfor])
  const getFields = () => {
    const children = [];
    children.push(
      <Col span={12} key='yhm'>
        <Form.Item
          name='yhm'
          label={'?????????'}
        >
          <Input />
        </Form.Item>
      </Col>,
      <Col span={12} key='bm'>
        <Form.Item
          name='bm'
          label={'??????'}
        >
          <Select>
            <Option value="1">?????????</Option>
            <Option value="4">?????????</Option>
            <Option value="5">?????????</Option>
            <Option value="6">?????????</Option>
          </Select>
        </Form.Item>
      </Col>,

      expand ? <Col span={12} key='cjks'>
        <Form.Item name="cjsj" label="????????????">
          <RangePicker style={{ width: '400px' }} />
        </Form.Item>
      </Col> : null
    );

    return children;
  };
  const onFinish = (values) => {
    let a = '';
    let b = '';
    console.log('Received values of form: ', values);
    if (values.cjsj && values.cjsj[0].$D < 10) {
      values.cjsj[0].$D = `0${values.cjsj[0].$D}`
      a = `${values.cjsj[0].$y}-${values.cjsj[0].$M + 1}-${values.cjsj[0].$D}`;
    } else {
      values.cjsj = ''
    }
    if (values.cjsj && values.cjsj[1].$D < 10) {
      values.cjsj[1].$D = `0${values.cjsj[1].$D}`
      b = `${values.cjsj[1].$y}-${values.cjsj[1].$M + 1}-${values.cjsj[1].$D}`;
    } else {
      values.cjsj = ''
    }
    if (!values.yhm) {
      values.yhm = ''
    }
    if (!values.bm) {
      values.bm = ''
    }
    userList(`pageSize=${10}&pageNum=${pageNumber || 1}&username=${values.yhm}&deptId=${values.bm}&createTimeFrom=${a}&createTimeTo=${b}`).then(res => {
      setUserDataList(res.rows);
      setTotal(res.total)
    })
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setGetOptions(newSelectedRowKeys)
    // console.log('selectedRowKeys changed1: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  function onChange(pageNumber, pageSize) {
    getList(pageSize, pageNumber);
    // console.log(pageSize, pageNumber);
    setPageNumber(pageNumber);
  }
  function getList(a, b) {
    userList(`pageSize=${a}&pageNum=${b}`).then(res => {
      setUserDataList(res.rows)
      setTotal(res.total)
    })
  }
  const [open, setOpen] = useState(false);
  const showModal = (a) => {
    setOpen(true);
    userDataList.forEach(item => {
      if (item.userId == a) {
        setSearchInfor(item);
      }
    })
  };
  const hideModal = () => {
    setOpen(false);
  };
  function judgeSex(a) {
    if (a == '0') {
      return a = '???'
    } else if (a == '1') {
      return a = '???'
    } else {
      return a = '??????'
    }
  }
  function judgeStatus(a) {
    if (a == '1') {
      a = '??????'
    } else {
      a = '??????'
    }
    return (
      <Tag color={a == '??????' ? 'green' : 'red'} key={a}>
        {a.toUpperCase()}
      </Tag>
    );
  }
  function getStatus(e) {
    // console.log(e);
    setStatusValue(e.target.value);
  }
  function getSsex(e) {
    setSsexValue(e.target.value);
  }
  function addPost() {
    addUser({
      username: username.current.input.value,
      password: password.current.input.value,
      email: email.current.input.value,
      mobile: mobile.current.input.value,
      roleId: roleValue.toString(),
      status: statusValue,
      ssex: ssexValue,
      deptId: deptValue
    }).then(() => {
      userList(`pageSize=${10}&pageNum=${pageNumber || 1}`).then((res) => {
        setUserDataList(res.rows)
        setTotal(res.total)
        message.success('????????????');
        setOpenDrawer(false);
        updatePage(e => e + 1);
      })
    })
  }
  function updatePost() {
    updateUser({
      username: username.current.input.value,
      email: email.current.input.value,
      mobile: mobile.current.input.value,
      roleId: roleValue.toString() || searchInfor.roleId,
      status: statusValue || searchInfor.status,
      ssex: ssexValue || searchInfor.ssex,
      deptId: deptValue,
      userId: searchInfor.userId
    }).then(() => {
      userList(`pageSize=${10}&pageNum=${pageNumber || 1}`).then((res) => {
        setUserDataList(res.rows)
        setTotal(res.total)
        setOpenDrawer(false);
        message.success('????????????');
        updatePage(e => e + 1);
      })
    })
  }
  function del() {
    if (getOptions) {
      let a = [];
      userDataList.forEach(item => {
        getOptions.forEach(item2 => {
          if (item2 == item.userId) {
            a.push(item.username)
          }
        })
      })
      confirm({
        title: '??????',
        icon: <ExclamationCircleFilled />,
        content: `???????????????${a.toString()}??????`,
        onOk() {
          delUser(getOptions).then(() => {
            userList(`pageSize=${10}&pageNum=${pageNumber || 1}`).then((res) => {
              setUserDataList(res.rows)
              setTotal(res.total)
              message.success('????????????');
              updatePage(e => e + 1);
            })
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      messageApi.open({
        type: 'warning',
        content: '??????????????????????????????',
      });
    }

  }
  const update = (a) => {
    updatePage(e => e + 1);
    userDataList.forEach(item => {
      if (item.userId == a) {
        setSearchInfor(item);
      }
    })
    setOpenDrawer(true);
    setAddAndUpdate(true);
  }
  function selectRole(e) {
    let a = [];
    a.push(e);
    setRoleValue(a);
  }
  function selectDept(e) {
    setDeptValue(e);
  }
  const items = [
    {
      key: '1',
      label: (
        <div onClick={passwordReset}>
          ????????????
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={getExcel}>
          ??????Excel
        </div>
      ),
    },
  ];
  const [messageApi, contextHolder] = message.useMessage();
  function passwordReset() {
    if (getOptions) {
      confirm({
        title: '???????????????????????????????????????',
        icon: <ExclamationCircleFilled />,
        content: '??????????????????????????????????????????????????????????????????1234qwer',
        onOk() {
          reset({ usernames: getOptions }).then(() => {
            message.success('??????????????????');
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      messageApi.open({
        type: 'warning',
        content: '????????????????????????????????????',
      });
    }
  }
  function getExcel() {
    excel().then(() => {
      messageApi.open({
        type: 'loading',
        content: '???????????????',
        duration: 0,
      });
      setTimeout(messageApi.destroy, 2500);
    })
  }
  return (
    <div>
      <Breadcrumb style={{ marginBottom: '40px' }}>
        <Breadcrumb.Item><Link to="/home/index">????????????</Link></Breadcrumb.Item>
        <Breadcrumb.Item>
          ????????????
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          ????????????
        </Breadcrumb.Item>
      </Breadcrumb>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col
            span={24}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => {
                form.resetFields();
              }}
            >
              ??????
            </Button>
            <a
              style={{
                fontSize: 12,
              }}
              onClick={() => {
                setExpand(!expand);
              }}
            >
              {expand ? <UpOutlined /> : <DownOutlined />} ??????
            </a>
          </Col>
        </Row>
        <Button style={{ marginRight: '10px' }} onClick={showDrawer}>??????</Button>
        <Button style={{ marginRight: '10px' }} onClick={del}>??????</Button>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottom"
        >
          <Button>????????????
              <IconFont type="icon-keyboard_arrow_down" />
          </Button>
        </Dropdown>
      </Form>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={userDataList}
        rowKey='userId'
        pagination={{ total, onChange, showTotal: (total, range) => `??????${range[0]}-${range[1]} ??????????????? ${total} ?????????`, pageSizeOptions: [10, 20, 30, 40], showSizeChanger: true }}
        style={{ marginTop: '20px' }}
        onChange={handleChange}
      />
      <Modal
        title="????????????"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="??????"
        cancelText="??????"
        width='750px'
      >
        <table style={{ width: '700px' }}>
          <tbody>
            <tr>
              <td rowSpan='4'><img src={"http://xawn.f3322.net:8002/distremote/static/avatar/" + searchInfor.avatar} alt="" style={{ width: '115px', height: '115px', borderRadius: '5px' }} /></td>
              <td><IconFont type="icon-jurassic_user"/>&nbsp;&nbsp;&nbsp;?????????{searchInfor.username}</td>
              <td><IconFont type="icon-fangzi" />&nbsp;&nbsp;&nbsp;?????????{searchInfor.deptName}</td>
            </tr>
            <tr>
              <td><IconFont type="icon-star" />&nbsp;&nbsp;&nbsp;?????????{searchInfor.roleName}</td>
              <td><IconFont type="icon-xiaolian" />&nbsp;&nbsp;&nbsp;?????????{judgeStatus(searchInfor.status)}</td>
            </tr>
            <tr>
              <td><IconFont type="icon-clothes" />&nbsp;&nbsp;&nbsp;?????????{judgeSex(searchInfor.ssex)}</td>
              <td><IconFont type="icon-shijian_o" />&nbsp;&nbsp;&nbsp;???????????????{searchInfor.createTime}</td>
            </tr>
            <tr>
              <td><IconFont type="icon-dianhuazixun-dianhua" />&nbsp;&nbsp;&nbsp;?????????{searchInfor.mobile}</td>
              <td><IconFont type="icon-denglu" />&nbsp;&nbsp;&nbsp;???????????????{searchInfor.lastLoginTime}</td>
            </tr>
            <tr>
              <td></td>
              <td><IconFont type="icon-youxiang" />&nbsp;&nbsp;&nbsp;?????????{searchInfor.email}</td>
              <td><IconFont type="icon-62" />&nbsp;&nbsp;&nbsp;?????????{searchInfor.description}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
      <Drawer
        title={addAndUpdate ? "????????????" : "????????????"}
        width={720}
        onClose={onClose}
        open={openDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>??????</Button>
            <Button onClick={addAndUpdate ? updatePost : addPost} type="primary">
              ??????
            </Button>
          </Space>
        }
      >
        {Page ? <Form layout="vertical" hideRequiredMark initialValues={{
          'username': searchInfor.username,
          'email': searchInfor.email,
          'mobile': searchInfor.mobile,
          'roleName': addAndUpdate ? searchInfor.roleId.split(',') : [],
          'deptName': searchInfor.deptName,
          'status': searchInfor.status,
          'ssex': searchInfor.ssex,
        }}>
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                name="username"
                label="?????????"
                rules={[
                  {
                    required: true,
                    message: '??????????????????',
                  },
                ]}
              >
                <Input ref={username} />
              </Form.Item>
            </Col>
            {
              addAndUpdate == false && <Col span={18}>
                <Form.Item
                  name="password"
                  label="??????"
                  rules={[
                    {
                      required: true,
                      message: '???????????????',
                    },
                  ]}
                >
                  <Input.Password ref={password} />
                </Form.Item>
              </Col>
            }
            <Col span={18}>
              <Form.Item
                name="email"
                label="??????"
              >
                <Input ref={email} />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                name="mobile"
                label="??????"
              >
                <Input ref={mobile} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                name="roleName"
                label="??????"
                rules={[
                  {
                    required: true,
                    message: '???????????????',
                  },
                ]}
              >
                <Select onChange={selectRole} mode="multiple">
                  <Option value="1">?????????</Option>
                  <Option value="2">????????????</Option>
                  <Option value="72">????????????</Option>
                  <Option value="73">??????</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                name="deptName"
                label="??????"
              >
                <Select onChange={selectDept}>
                  <Option value="1">?????????</Option>
                  <Option value="4">?????????</Option>
                  <Option value="5">?????????</Option>
                  <Option value="6">?????????</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="??????"
                rules={[
                  {
                    required: true,
                    message: '???????????????',
                  },
                ]}
              >
                <Radio.Group onChange={getStatus} value={statusValue}>
                  <Radio value={'0'}>??????</Radio>
                  <Radio value={'1'}>??????</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ssex"
                label="??????"
                rules={[
                  {
                    required: true,
                    message: '???????????????',
                  },
                ]}
              >
                <Radio.Group onChange={getSsex} value={ssexValue}>
                  <Radio value={'0'}>???</Radio>
                  <Radio value={'1'}>???</Radio>
                  <Radio value={'2'}>??????</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
          : null}
      </Drawer>
      {contextHolder}
    </div>
  )
}
