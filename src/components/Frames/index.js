import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Dropdown, Avatar } from 'antd'
import {withRouter } from 'react-router-dom'
import './index.less'
import logo from './logo.png'
import { connect } from 'react-redux'
import { logout } from '../../actions/user'
import {getonlineNumber} from '../../requests'

const { Header, Content, Footer } = Layout;

const mapState = state => {
    return {
      displayName: state.user.userNickname
    }
  }

@connect(mapState, {logout })
@withRouter
class Frames extends Component {
    constructor(){
        super()
        this.state = {
            userNumber:"0"
        }
    }

    menuHandleClick = ({key})=>{
        if (key === '/logout') {
            this.props.logout()
          } else {
            this.props.history.push(key)
          }
    }

    //请求数据
    getMessage = () => {
        getonlineNumber()
        .then((res) => {
            this.setState({
                userNumber:res
            })
        }).catch(() => {
            
        })
    }

    // //在页面加载完的时候设置一个定时器
    // componentDidMount() {
    //     this.getMessage()
    //     this.interval = setInterval(() => this.getMessage(), 3000);
    // }

    // //组件销毁的时候清除定时器就行
    // componentWillUnmount() {
    //     clearInterval(this.interval);
    // }

    menu = (
        <Menu onClick={this.menuHandleClick}>
          <Menu.Item key='/summitexam/settings'>
              个人设置
          </Menu.Item>
          <Menu.Item key='/logout'>
              退出登录
          </Menu.Item>
        </Menu>
    );

    menuClick = ({key}) =>{
        this.props.history.push(key)        
    }
    

    render() {
        const selectedKeyArr = this.props.location.pathname.split('/')
        selectedKeyArr.length = 3
        return (
            <Layout className="layout ">
                <Header className="se-header">
                <div className="se-logo" >
                    <img src={logo} alt="SUMMITEXAM"/>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[selectedKeyArr.join('/')]}
                    onClick = {this.menuClick}
                    style={{ lineHeight: '64px' }}
                    className="se-Menu"
                >
                    {
                        this.props.menus.map(item=>{
                            return (
                                <Menu.Item key={item.pathname}>
                                    <Icon type={item.icon} />
                                    {item.title}
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>
                {/* <div style={{marginRight:100}}>
                    <span>系统当前在线人数为:{this.state.userNumber}</span>
                </div>  */}
                <Dropdown overlay={this.menu}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        <span style={{color:'#fff'}}>{this.props.displayName}</span>
                    </div>
                </Dropdown>
                </Header>
                <Content style={{}}>
                <div style={{minHeight: 480 }}>{this.props.children}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        );
    }
}

export default Frames;