import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Button, Avatar} from 'antd';
import {connect} from 'react-redux'
import Question from './question.js'

import {Counter} from '../../components'
import exam from './exam.png'
import {insertExamRecord, getExamsById} from '../../requests'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const mapState = state => ({
    userNickname : state.user.userNickname,
    userRoleId : state.user.userRoleId
})


Date.prototype.format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };

    // 根据y的长度来截取年
    if (/(y+)/.test(fmt)){ 
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}


@connect(mapState)
class Exam extends Component {
    constructor(){
        super()
        this.state = {
            hou:"",
            minutes:"",
            flag:true,
            flagTimer:false,
            questionId:"",
            defalutSelectAnswer:"",
            defalutCheckAnswer:[],
            examTimeCost:"",
            examsId:"",
            examId:"",
            examName:"",
            examsScore:"",
            examsDescription:"",
            examsScoreRadio:"",
            examsScoreCheck:"",
            examsScoreJudge:"",
            examTimeLimit:"",
            radioLists:[],
            checkLists:[],
            judgeLists:[],
            answerOptionIds:"",
            examScore:"",
            examsName:"",
            examsScore:""
        }
    }

    componentDidMount(){
        let search = this.props.history.location.search
        search = search.substr(1,search.length)
        const value = JSON.parse(decodeURI(search))
        
        //拿到试卷表的id
        const {
            examsName,
            examsScore,
            examsId,
            examId,
            examName,
            examTimeLimit
        } = value;
        
        let hou = parseInt(examTimeLimit / 60);
        let minutes = examTimeLimit % 60;
        this.setState({
            examsId:examsId,
            examId:examId,
            examName:examName,
            examTimeLimit : examTimeLimit,
            examsName,
            examsScore,
            hou,
            minutes
        },()=>{
            this.getData(examsId)
        })
    }

    getData = (id) => {
        getExamsById(id).then(resp=>{
            this.initData(resp)
        })
    }

    initData = (value)=>{
        this.setState({
            examScore : value.examsScore
        })
        let radioLists = []
        let checkLists = []
        let judgeLists = []
        if(null != value.examQuestionIdsRadio){
            let radios = value.examQuestionIdsRadio.split('-');
            radios.map(item =>{
                var radio = {
                    questionId:item,
                    select:false,
                    answer:"",
                    selectAnswer:""
                }
                radioLists.push(radio)
            })
        }

        if(null != value.examQuestionIdsCheck){
            let checks = value.examQuestionIdsCheck.split('-');
            checks.map(item =>{
                var check = {
                    questionId:item,
                    select:false,
                    answer:"",
                    selectAnswer:""
                }
                checkLists.push(check)
            })
        }

        if(null != value.examQuestionIdsJudge){
            let judges = value.examQuestionIdsJudge.split('-');
            judges.map(item =>{
                var judge = {
                    questionId:item,
                    select:false,
                    answer:"",
                    selectAnswer:""
                }
                judgeLists.push(judge)
            })
        }
        this.setState({
            radioLists,
            checkLists,
            judgeLists,
            examsScoreRadio:value.examsScoreRadio,
            examsScoreCheck:value.examsScoreCheck,
            examsScoreJudge:value.examsScoreJudge
        })
    }

    //子组件渲染是否选择图标事件
    //type判断是啥题型
    handleSelect = (type,questionId,selectAnswer,answer)=>{
        this.setState({
            defalutSelectAnswer:selectAnswer,
        })
        if(type == 1){
            const radioLists = this.state.radioLists
            radioLists.map(
                item => {
                    if(questionId == item.questionId){
                        item.select = true;
                        item.selectAnswer = selectAnswer;
                        item.answer = answer;
                    }
                }
            )
            this.setState({
                radioLists
            })
        }else if(type == 2){
            const checkLists = this.state.checkLists
            checkLists.map(
                item => {
                    if(questionId == item.questionId){
                        item.select = true;
                        item.selectAnswer = selectAnswer;
                        item.answer = answer;
                    }
                }
            )
            this.setState({
                defalutCheckAnswer:selectAnswer.split('-')
            })
            this.setState({
                checkLists
            })
        }else if(type ==3){
            const judgeLists = this.state.judgeLists
            judgeLists.map(
                item => {
                    if(questionId == item.questionId){
                        item.select = true;
                        item.selectAnswer = selectAnswer;
                        item.answer = answer;
                    }
                }
            )
            this.setState({
                judgeLists
            })
        }
    }

    //处理题目点击事件,传输默认的
    menuClick = ({ item, key, keyPath, domEvent }) =>{
        this.setState({
            defalutCheckAnswer:item.props.selectanswer.split('-'),
            defalutSelectAnswer:item.props.selectanswer,
            questionId:key,
            flag:false
        })
    }

    //交卷结算环节
    handleClick = () => {
        //更改状态值，触发计时组件的函数
        this.setState({
            flagTimer:true
        })  
    }

    //查回耗费时间后在调用
    handlePost = () =>{
        const {
            examId,
            examName,
            examScore
        } = this.state
        let {score,answerOptionIds} = this.manageScore()
        let examResultLevel
        if(score >= examScore*0.9){
            examResultLevel = 1
        }else if(score >= examScore*0.8){
            examResultLevel = 2
        }else if(score >= examScore*0.7){
            examResultLevel = 3
        }else if(score >= examScore*0.6){
            examResultLevel = 4
        }else{
            examResultLevel = 5
        }
    
        insertExamRecord(examId,examName,score,new Date().format("yyyy-MM-dd hh:mm:ss"),examResultLevel,this.state.examTimeCost,answerOptionIds).then(
            resp => {
                this.props.history.push('/summitexam/exam-record-list')
            }
        )
    }

    //统计分数 examsScoreRadio:"",题目id@False_选择的题目选项id$题目id@True
    manageScore = () => {
        let answerOptionIds = "";
        let score = 0

        const {
            radioLists,
            checkLists,
            judgeLists,
            examsScoreCheck,
            examsScoreJudge,
            examsScoreRadio
        } = this.state
        radioLists.map(
            item => {
                if(item.answer != "" && item.selectAnswer == item.answer){
                    score += examsScoreRadio
                    answerOptionIds += "$" + item.questionId + "@True";
                }else if(item.selectAnswer != ""){
                    answerOptionIds += "$" + item.questionId + "@False_" + item.selectAnswer;
                }else{
                    answerOptionIds += "$" + item.questionId + "@False";
                }
            }
        )

        //多选这里修改判卷规则
        //全对才加分
        // checkLists.map(
        //     item => {
        //         if(item.answer != "" && item.selectAnswer == item.answer){
        //             score += examsScoreCheck
        //         }
        //     }
        // )
        //答对一半给半分
        checkLists.map(
            item => {
                debugger
                if(item.answer != "" && item.selectAnswer == item.answer){
                    score += examsScoreCheck
                    answerOptionIds += "$" + item.questionId + "@True";
                }else if(item.answer != "" && item.answer.indexOf(item.selectAnswer) != -1){
                    answerOptionIds += "$" + item.questionId + "@False_" + item.selectAnswer;
                    score += (examsScoreCheck / 2)
                }else if(item.selectAnswer != ""){
                    answerOptionIds += "$" + item.questionId + "@False_" + item.selectAnswer;
                }else{
                    answerOptionIds += "$" + item.questionId + "@False";
                }
            }
        )
        judgeLists.map(
            item => {
                if(item.answer != "" && item.selectAnswer == item.answer){
                    score += examsScoreJudge
                    answerOptionIds += "$" + item.questionId + "@True";
                }else if(item.selectAnswer != ""){
                    answerOptionIds += "$" + item.questionId + "@False_" + item.selectAnswer;
                }else{
                    answerOptionIds += "$" + item.questionId + "@False";
                }
            }
        )
        answerOptionIds = answerOptionIds.substring(1,answerOptionIds.length) 
        this.setState({
            answerOptionIds
        })
        return {score , answerOptionIds}
    }

    //将子组件传来的花费时间放进state中
    handleTimer = (value)=>{
        //当不满一分钟时，补全为一分钟
        if(value == 0){
            value = 1
        }
        
        this.setState({
            examTimeCost:value
        },()=>{
            this.handlePost()
        })
    }

    render() {
        return (
            <Layout>
                <Header className="se-header">
                    <div className="se-logo" >
                        <img style={{marginBottom:12}} src={exam} alt="exam"/>
                        {
                            this.props.userRoleId != 3 
                            ?
                            <>
                                <span style={{fontSize:24,fontWeight:"bold",paddingRight:10}}>{this.state.examsName}</span>
                                <span>试卷分数为{this.state.examsScore}</span>
                            </>
                            :
                            <>
                                <span style={{fontSize:24,fontWeight:"bold",paddingRight:10}}>{this.state.examName}</span>
                                <span>考试分数为{this.state.examScore}</span>
                            </>
                        }
                    </div>
                    {
                        this.props.userRoleId != 3 
                        ?
                        ""
                        :
                        <div className="se-title" styl={{alignItems: 'center'}}>
                            <span style={{fontSize:20,fontWeight:540,marginRight:120}}>
                                考试限时 :  {this.state.examTimeLimit}分钟

                                这里是计时:(<Counter 
                                                hou={this.state.hou} 
                                                minutes={this.state.minutes} 
                                                handleClick={this.handleClick} 
                                                handleTimer={this.handleTimer}   
                                                flagTimer={this.state.flagTimer}
                                            />)                  
                            </span>
                            <Button type="primary" ghost style={{marginRight:40}} onClick={this.handleClick}>交卷</Button>
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{marginBottom:8}}/>
                            <span>{this.props.userNickname}</span>
                        </div>
                    }
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
                                    <Menu.Item key={item.questionId} selectanswer={item.selectAnswer}>
                                        {
                                           item.select ? <Icon  type="eye" style={{color: '#66FFCC'}}/>: "" 
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
                                    <Menu.Item key={item.questionId} selectanswer={item.selectAnswer}>
                                        {
                                           item.select ? <Icon  type="eye" style={{color: '#66FFCC'}}/>: "" 
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
                                    <Menu.Item key={item.questionId} selectanswer={item.selectAnswer}>
                                        {
                                           item.select ? <Icon  type="eye" style={{color: '#66FFCC'}}/>: "" 
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
                                this.props.userRoleId != 3 
                                ?
                                <span style={{fontSize:30}}>点击左侧题目编号查看详情</span>
                                :
                                <span style={{fontSize:30}}>点击左侧题目编号开始答题</span>
                            :
                            <Question 
                                 questionId={this.state.questionId}  
                                 defalutSelectAnswer={this.state.defalutSelectAnswer}
                                 handleSelect={this.handleSelect}
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

export default Exam