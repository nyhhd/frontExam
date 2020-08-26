import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Button, Avatar} from 'antd';
import {connect} from 'react-redux'
import Question from './question.js'

import exam from './exam.png'
import {selectExamRecordById} from '../../requests'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const mapState = state => ({
    userNickname : state.user.userNickname
})



@connect(mapState)
class ExamRecord extends Component {
    constructor(){
        super()
        this.state = {
            examQuestionIdsRadio:"",
            examQuestionIdsCheck:"",
            examQuestionIdsJudge:"",
            examsScoreJudge : "",
            examsScoreCheck : "",
            examsScoreRadio : "",
            answerOptionIds:"",
            radioLists:[],
            checkLists:[],
            judgeLists:[],
            answerOptionIds:"",
            examRecord:{},
            flag:true,
            isRight:""
        }
    }

    componentDidMount(){
        let search = this.props.history.location.search
        search = search.substr(1,search.length)
        const value = JSON.parse(decodeURI(search))
        this.getData(value)
    }

    initData = () => {
        //将拿到的选择题目字符串进行处理
        //比如:$9001@True$9002@False$9010@False_9008$9005@False
        let questions = [];
        const str = this.state.answerOptionIds;
        if(null != str && str != ""){
            var arr = str.split("$")
            arr.map(item => {
                var question = {};
                var arr2 = item.split("@")
                question.id = arr2[0]
                if(arr2[1] != null){
                    var arr3 = arr2[1].split("_")
                    question.isRight = arr3[0]
                }
                if(arr3.length > 1){
                    question.selectOption = arr3.slice(1,arr3.length)
                }
                questions.push(question)
            })
        }

        let radioLists = []
        let checkLists = []
        let judgeLists = []
        if(null != this.state.examQuestionIdsRadio){
            let radios = this.state.examQuestionIdsRadio.split('-');
            radios.map(item =>{
                questions.map(ques => {
                    if(ques.id == item){
                        var radio = {
                            questionId:item,
                            isRight:ques.isRight,
                            selectAnswer:ques.selectOption
                        }
                        radioLists.push(radio)
                    }
                })
            })
        }

        if(null != this.state.examQuestionIdsCheck){
            let checks = this.state.examQuestionIdsCheck.split('-');
            checks.map(item =>{
                questions.map(ques => {
                    if(ques.id == item){
                        var check = {
                            questionId:item,
                            isRight:ques.isRight,
                            selectAnswer:ques.selectOption
                        }
                        checkLists.push(check)
                    }
                })
            })
        }

        if(null != this.state.examQuestionIdsJudge){
            let judges = this.state.examQuestionIdsJudge.split('-');
            judges.map(item =>{
                questions.map(ques => {
                    if(ques.id == item){
                        var judge = {
                            questionId:item,
                            isRight:ques.isRight,
                            selectAnswer:ques.selectOption
                        }
                        judgeLists.push(judge)
                    }
                })
            })
        }
        this.setState({
            radioLists,
            checkLists,
            judgeLists
        })
    }

    getData = (value)=>{
        selectExamRecordById(value).then(resp => {
            this.setState({
                examQuestionIdsRadio : resp.exams.examQuestionIdsRadio,
                examQuestionIdsCheck : resp.exams.examQuestionIdsCheck,
                examQuestionIdsJudge : resp.exams.examQuestionIdsJudge,
                examsScoreJudge : resp.exams.examsScoreJudge,
                examsScoreCheck : resp.exams.examsScoreCheck,
                examsScoreRadio : resp.exams.examsScoreRadio, 
                answerOptionIds : resp.answerOptionIds,
                examRecord : resp
            },() => {
                this.initData();
            })
        })     
    }

    //处理题目点击事件,传输默认的
    menuClick = ({ item, key, keyPath, domEvent }) =>{
        if(item.props.selectanswer == undefined){
            this.setState({
                defalutCheckAnswer:undefined,
                defalutSelectAnswer:undefined
            })
        }

        if(item.props.type == "check"){
            this.setState({
                defalutCheckAnswer:item.props.selectanswer
            })
        }else if(item.props.selectanswer != undefined){
            this.setState({
                defalutSelectAnswer:item.props.selectanswer[0]
            })
        }
        this.setState({
            isRight:item.props.isRight,
            questionId:key,
            flag:false
        })
    }

    //9001@True$9002@False$9010@False_9008$9005@False
    render() {
        return (
            <Layout>
                <Header className="se-header">
                    <div className="se-logo" >
                        <img style={{marginBottom:12}} src={exam} alt="exam"/>
                        <span style={{fontSize:24,fontWeight:"bold",paddingRight:6}}>{this.state.examRecord.examsName}</span>
                        <span>分数：{this.state.examRecord.examJoinScore}</span>
                    </div>
                    <div className="se-title" styl={{alignItems: 'center'}}>
                        <span style={{fontSize:20,fontWeight:540,marginRight:120}}>
                            考试耗时 :  {this.state.examRecord.examTimeCost}分钟   
                        </span>
                        <span style={{fontSize:20,fontWeight:500}}>考生 ：{this.state.examRecord.examJoinerName}</span>
                    </div>
                </Header>
                <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1','sub2','sub3']}
                        style={{ height: '100%', borderRight: 0 }}
                        onClick = {this.menuClick}
                    >
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="check-circle" />
                                单选题(每题{this.state.examsScoreRadio}分)
                            </span>
                        }
                    >
                        {
                            this.state.radioLists.map((item,index)=>{
                                return (
                                    <Menu.Item key={item.questionId} selectanswer={item.selectAnswer} isRight={item.isRight}>
                                        {
                                           item.isRight == "True" ? <Icon  type="check" style={{color: '#66FFCC'}}/>: <Icon  type="close" style={{color: '#c62828'}}/> 
                                        }
                                        题目{index+1}
                                    </Menu.Item>
                                )
                            })
                        }
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="check-square" />
                                多选题(每题{this.state.examsScoreCheck}分)
                            </span>
                        }
                    >
                        {
                            this.state.checkLists.map((item,index)=>{
                                return (
                                    <Menu.Item key={item.questionId} selectanswer={item.selectAnswer} isRight={item.isRight} type="check">
                                        {
                                           item.isRight == "True" ? <Icon  type="check" style={{color: '#66FFCC'}}/>: <Icon  type="close" style={{color: '#c62828'}}/> 
                                        }
                                        题目{index+1}
                                    </Menu.Item>
                                )
                            })
                        }
                    </SubMenu>
                    <SubMenu
                        key="sub3"
                        title={
                            <span>
                                <Icon type="audit" />                            
                                判断题(每题{this.state.examsScoreJudge}分)
                            </span>
                        }
                    >
                        {
                            this.state.judgeLists.map((item,index)=>{
                                return (
                                    <Menu.Item key={item.questionId} selectanswer={item.selectAnswer} isRight={item.isRight}>
                                        {
                                            item.isRight == "True" ? <Icon  type="check" style={{color: '#66FFCC'}}/>: <Icon  type="close" style={{color: '#c62828'}}/> 
                                        }
                                        题目{index+1}
                                    </Menu.Item>
                                )
                            })
                        }
                    </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '24px 24px 24px' }}>
                    <Content
                    style={{
                        background: '#fff',
                        padding: 24,
                        margin: 0,
                        minHeight: 540,
                    }}
                    >
                        {
                            this.state.flag
                            ?
                            <span style={{fontSize:30}}>点击左侧题目编号查看具体答题信息</span>
                            :
                            <Question
                                 isRight={this.state.isRight} 
                                 questionId={this.state.questionId}  
                                 defalutSelectAnswer={this.state.defalutSelectAnswer}
                                 defalutCheckAnswer={this.state.defalutCheckAnswer}
                            />
                        }
                    </Content>
                </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default ExamRecord