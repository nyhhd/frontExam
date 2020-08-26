import React, { Component } from 'react'
import './index.css';

export default class NotFound extends Component {
    render() {
        return (
            <div id="ai">
                    <br/><br/><br/><br/><br/><br/><br/>
                    <h1 className="haha">404<br/>Not Found</h1>
                    <p>页面无法访问</p>
                    <p class="quotething"> 可能原因：<br /><br />页面不存在或已被删除<br/><br/>链接地址输入有误<br/><br/>页面正在进行调整中<br/><br/>页面链接地址已被更改<br/></p>
                    <br />
                    <div align="center">
                        <a href="/" style={{marginRight:40}}><input type="button" class="button" value="返回首页" /></a>
                        <a href="https://www.cnblogs.com/nyhhd/"><input type="button" class="button" value="联系站长" /></a>
                    </div>
            </div>
        )
    }
}
