import React, { Component } from 'react';
 
import reqwest from 'reqwest';
import axios from 'axios'


import { Upload, message, Button, Icon ,Spin} from 'antd';




class Register extends React.Component {
    constructor(){
        super()
        this.state = {
            isLoading:false
        }
    }

    handleUploadAvatar = ({file}) => {
        this.setState({
            isLoading: true
        });
        const data = new FormData()
        data.append('editormd-image-file', file)

        // axios.post('http://106.12.93.151:8080/qiantai/uploadController/upload', data)
        axios.post('http://127.0.0.1:8080/summitexam-manager-web/uploadController/upload', data)
            .then(result => {
                if(result.status == 200){
                    message.success("上传成功")
                }else{
                    message.error("上传失败")
                }
                this.setState({
                    isLoading: false,
                    ImageUrl: result.data
                });
            }).catch(
                error => {
                    message.error("上传失败")
                }
            )
    };

    render() {

        return (
            <Upload
                listType="picture-card"
                customRequest={this.handleUploadAvatar}
                showUploadList={false}
                
            >
                <Button>
                    <Icon type="upload" /> 插入题干图片
                </Button>
                <Spin spinning={this.state.isLoading}/>
            </Upload>
        );
    }
}

export default Register