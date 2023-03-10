import React,{useEffect} from 'react';
import '../style/css/login.css'
import { Button, Checkbox, Form, Input, message,Tabs } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import { loginApi } from '../apis/ums';
import {useNavigate} from 'react-router-dom'

import logo from '../style/imgs/logo.png'

export default function Login() {
  const navigate=useNavigate();
  const onFinish = (values) => {
    console.log('Success:', values);
    loginApi(values).then(res=>{
      console.log(res);
      localStorage.token=res.data.token;
      localStorage.permissions=JSON.stringify(res.data.permissions);
      localStorage.roles=JSON.stringify(res.data.roles);
      localStorage.user=JSON.stringify(res.data.user);
      navigate('/home',{replace:true});
      message.success('登录成功');
    })
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div style={{ width: '100vw' }}>
        <div style={{ textAlign: 'center', marginTop: '116px' }}>
            <img src={logo} alt="" style={{ width: '39px', height: '19px', marginRight: "16px" }} />
            <span style={{ fontSize: '28px' }}>赤兔养车</span></div>
        {/* 选项框 */}
        <div>
            <Tabs centered>
                <TabPane tab="账号密码登录" key="1">
                    <Form
                        onFinish={onFinish}>
                        <Form.Item
                            name='username'
                            rules={[{ required: true, message: 'Please input your username!' }]}
                            style={{ textAlign: 'center' }}
                        >
                            <Input style={{ width: '360px' }} />
                        </Form.Item>

                        <Form.Item
                            name='password'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            style={{ textAlign: 'center' }}
                        >
                            <Input.Password style={{ width: '360px' }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ position: 'absolute', left: '50%', translate: '-50%', width: '360px' }}>点击登陆</Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="手机号登录" key="2">
                    <Form>
                        <Form.Item
                            rules={[{ required: true, message: 'Please input your username!' }]}
                            style={{ textAlign: 'center' }}
                        >
                            <Input style={{ width: '360px' }} />
                        </Form.Item>

                        <Form.Item
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            style={{ textAlign: 'center' }}
                        >
                            <Input.Password style={{ width: '320px' }} placeholder='请输入手机号' />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ position: 'absolute', left: '50%', translate: '-50%', width: '360px' }}>点击登陆</Button>
                        </Form.Item>
                    </Form>
                </TabPane>

            </Tabs>

        </div>

    </div>
  )
}