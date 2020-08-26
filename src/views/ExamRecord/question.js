import React, { Component } from 'react'
import {selectQuestionById} from '../../requests'
import {Checkbox, Radio} from 'antd'

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginLeft: '30px'
};

export default class Question extends Component {
    constructor(props){
        super(props)
        let {defalutCheckAnswer} = props
        if(defalutCheckAnswer instanceof Array && defalutCheckAnswer.length > 0){
            defalutCheckAnswer = defalutCheckAnswer[0].split('-')
        }
        this.state = {
            isRight:props.isRight,
            questionId:props.questionId,
            defalutSelectAnswer:props.defalutSelectAnswer,
            defalutCheckAnswer:defalutCheckAnswer,
            questionOptionList:[],
            answerOptionList:[],
            questionAnswerOptionIds:"",
            questionTypeId:"",
            questionTypeDesc:"",
            questionName:"",
            questionPicture:"",
            questionDescription:""
        }
    }

    componentDidMount(){
        this.getData(this.state.questionId)
    }

    getData = (questionId)=>{
        selectQuestionById(questionId).then(
            resp => {
                const {
                    questionName,
                    questionOptionList,
                    questionAnswerOptionIds,
                    questionTypeId,
                    questionTypeDesc,
                    questionPicture,
                    questionDescription
                } = resp
                this.setState({
                    questionName,
                    questionOptionList,
                    questionAnswerOptionIds,
                    questionTypeId,
                    questionTypeDesc,
                    questionPicture,
                    questionDescription
                },()=>{
                    this.handleData()
                })
            }
        )
    }

    handleData = () => {
        //生成答案数据集合
        const questionAnswerOptionIds = this.state.questionAnswerOptionIds
        if(null != questionAnswerOptionIds && "" != questionAnswerOptionIds){
            let arrs = questionAnswerOptionIds.split("-");
            if(this.state.isRight == "True" && this.state.questionTypeId == 2){
                this.setState({
                    defalutCheckAnswer : arrs
                })
            }else if(this.state.isRight == "True"){
                this.setState({
                    defalutSelectAnswer : arrs[0]
                })
            }
            const questionOptionList = this.state.questionOptionList;
            let answerOptionList = []
            let answerOption = {}
            if(arrs instanceof  Array){
                arrs.map(id =>{
                    answerOption = questionOptionList.filter(item => {
                        if(id == item.questionOptionId){
                            return item
                        }
                    })
                    answerOptionList.push(answerOption[0])
                })
                this.setState({
                    answerOptionList
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            questionId,
            defalutSelectAnswer,
            isRight
        } = nextProps

        let {defalutCheckAnswer} = nextProps
        if(defalutCheckAnswer instanceof Array && defalutCheckAnswer.length > 0){
            defalutCheckAnswer = defalutCheckAnswer[0].split('-')
        }
        this.setState({
            questionId,
            defalutSelectAnswer,
            defalutCheckAnswer,
            isRight
        },()=> {
            this.getData(nextProps.questionId)
        })
    }

    render() {
        let flag = this.state.defalutSelectAnswer == undefined && this.state.defalutCheckAnswer == undefined && this.state.isRight == "False" 
        return (
            <>
               <div><span style={{fontSize:16,fontWeight:'bold'}}>{this.state.questionTypeDesc}：</span>{this.state.questionName}</div>
               {
                   this.state.questionTypeId == 2
                   ?
                   <Checkbox.Group style={{ width: '100%' }}  value={this.state.defalutCheckAnswer}>
                       {
                            this.state.questionOptionList.map(
                                item => {
                                    return (<Checkbox style={radioStyle} key={item.questionOptionId} value={item.questionOptionId+""}>
                                    {item.questionOptionContent}
                                    </Checkbox>)
                                }
                            )
                       }
                   </Checkbox.Group>
                   :
                   <Radio.Group value={this.state.defalutSelectAnswer}>
                       {
                           
                            this.state.questionOptionList.map(
                                item => {
                                    return (<Radio style={radioStyle} key={item.questionOptionId}  value={item.questionOptionId+""} disabled={true}>
                                    {item.questionOptionContent}
                                    </Radio>)
                                }
                            )
                       }
                    </Radio.Group>
               }
               {
                   flag
                   ?
                   <div>你选择的答案为空</div>
                   :
                   <></>
               }
               {
                   <div>
                         {
                            this.state.questionPicture != ""
                            ?
                            <img alt="example" style={{ width: '400px' ,height:'300px' }} src={this.state.questionPicture} />
                            :
                            ""
                        }
                   </div>
               }
               {
                   this.state.isRight == "False" 
                   ?                       
                    <div>
                    <span>正确答案为:</span>
                    {
                        this.state.answerOptionList.map(
                            item => {
                                return (
                                    <div style={{marginLeft:45}}>
                                        <span>{item.questionOptionContent}</span>
                                        <br/>
                                    </div>
                                )
                            }
                        )
                    }
                    </div>
                    :
                    <div></div>
               }
               {
                    <div>答案解析为：{this.state.questionDescription}</div>
               }
               
            </>
        )
    }
}
