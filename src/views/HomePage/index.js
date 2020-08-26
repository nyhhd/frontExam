import React, { Component } from 'react'
import { Row, Col, Button, Carousel} from 'antd';
import {connect} from 'react-redux';
import exam from './exam.png';
import examing from './examing.png';
import examRecord from './examRecord.png';
import home from './home.png';
import question from './question.png';
import {Register} from '../../components';

import ExamModal from './examModal.js';
import QuestionModal from './questionModal';

const mapState = state => ({
    userRoleId : state.user.userRoleId
})

@connect(mapState)
class HomePage extends Component {
    constructor(){
        super()
        this.state = {
            ExamVisible:false,
            QuestionVisible:false,
            buttonType:true
        }
    }

    showExamModal = () => {
        this.setState({
          ExamVisible: true,
          buttonType:true
        });
    };

    showQuestionModal = () => {
        this.setState({
            QuestionVisible: true,
            buttonType:false
        });
    };

    hideExamModal = () => {
        this.setState({
            ExamVisible: false,
        });
    }

    hideQuestionModal = () => {
        this.setState({
            QuestionVisible: false,
        });
    }

    render() {
        const style = this.props.userRoleId != 2 ? {marginTop:120,display:'none'} : {marginTop:120}
        const style1 = this.props.userRoleId != 2 ? {fontSize:40,marginTop:80} : {fontSize:40}
        return (
            <div style={{paddingTop:32}}>
                <ExamModal visible={this.state.ExamVisible} hideModal={this.hideExamModal}/>
                <QuestionModal visible={this.state.QuestionVisible} hideModal={this.hideQuestionModal}/>
                <Row type="flex">
                    <Col span={12} order={3} style={{textAlign:"center"}}>
                        <h1 style={style1}>Summit Exam</h1>
                        <h4>基于J2EE+react技术栈开发的在线考试系统</h4>
                        <div style={style}>
                            <Button type={this.state.buttonType?"primary":"default"} style={{marginRight:20}} onClick={this.showExamModal}>新建试卷</Button>
                            <Button type={this.state.buttonType?"default":"primary"} onClick={this.showQuestionModal}>新建题目</Button>
                        </div>
                    </Col>

                    <Col span={12} order={4} >
                        <Carousel autoplay dots>
                            <div>
                                <img  src={exam} style={{height:300, width:500}}/>
                            </div>
                            <div>
                                <img  src={examing} style={{height:300, width:500}}/>
                            </div>
                            <div>
                                <img  src={examRecord} style={{height:300, width:500}}/>
                            </div>
                            <div>
                                <img  src={home} style={{height:300, width:500}}/>
                            </div>
                            <div>
                                <img  src={question} style={{height:300, width:500}}/>
                            </div>
                        </Carousel>
                    </Col>
                </Row>
                <h2 style={{textAlign:"center",marginTop:60}}>
                    what can 
                    <span> Summit Exam </span>
                    do for you
                </h2>
            </div>
        )
    }
}

export default HomePage;