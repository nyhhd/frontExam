import React, { Component } from 'react'
import { Card, Col, Row } from 'antd';
import {getExam, deleteQuestion} from '../../requests'

//考试列表
class Exams extends Component {
    constructor(props){
        super(props)
        this.state = {
            examData:[],
            length:0
        }
    }

    componentDidMount(){
        this.getData()
    }

    getData = () => {
        getExam().then(
            resp => {
                this.setState({
                    examData:resp,
                    length:resp.length
                })
            }
        )
    }

    handleClick = () => {
        debugger
    }

    render() {
        return (
            <div style={{ background: '#ECECEC', padding: '30px' ,height: '480px'}}>
                <Row gutter={16}>            
                {
                    this.state.examData.length > 0
                    ?
                    this.state.examData.map(item =>{
                        return(
                            <Col span={8}>
                                <Card title={item.examName} bordered={false} hoverable={true} onClick={this.handleClick}>
                                    <Row>
                                        <Col span={8}>
                                            满分:<span>{item.examScore}</span>|
                                        </Col>
                                        <Col span={6}>
                                            限时:<span>{item.examTimeLimit}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            考试开始时间:<span>{item.examStartDate}</span>
                                        </Col>
                                        <span>|</span>
                                        <Col span={6}>
                                            考试截至时间:<span>{item.examEndDate}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        )
                    })
                    :
                    ""
                } 
                </Row>
            </div>
        )
    }
}

export default Exams