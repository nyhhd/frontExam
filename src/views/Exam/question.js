import React, { Component } from 'react'
import {selectQuestionById} from '../../requests'
import {Checkbox, Radio} from 'antd'
import {connect} from 'react-redux'

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginLeft: '30px'
};

const mapState = state => ({
    userNickname : state.user.userNickname,
    userRoleId : state.user.userRoleId
})

@connect(mapState)
class Question extends Component {
    constructor(props){
        super(props)
        this.state = {
            questionId:props.questionId,
            defalutSelectAnswer:props.defalutSelectAnswer,
            defalutCheckAnswer:props.defalutCheckAnswer,
            questionOptionList:[],
            questionAnswerOptionIds:"",
            questionTypeId:"",
            questionTypeDesc:"",
            questionName:"",
            questionPicture:"",
            selectValue:""
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
                    this.ininData()
                })
            }
        )
    }


    //当用户为出题者时默认显示出答案
    ininData = () => {
        if(this.props.userRoleId != 3){
            let {
                questionAnswerOptionIds,
                questionTypeId
            } = this.state
            let selectValue = ""
            if(questionTypeId == 2){
                selectValue = questionAnswerOptionIds.split('-');
            }else{
                selectValue = questionAnswerOptionIds + ""
            }
            this.setState({
                selectValue
            })
        }
    }



    //将选择的数据返回给父组件进行记录
    onRadioChange = e => {
        const {
            questionId,
            questionTypeId,
            questionAnswerOptionIds
        } = this.state
        this.props.handleSelect(questionTypeId,questionId,e.target.value,questionAnswerOptionIds)
    };

    //将选择的数据返回父组件进行记录
    onCheckChange = checkedValue =>{
        var str = ""
        checkedValue.map(item => {
            str += "-" + item 
        })
        const {
            questionId,
            questionTypeId,
            questionAnswerOptionIds
        } = this.state
        this.props.handleSelect(questionTypeId,questionId,str.substring(1,str.length),questionAnswerOptionIds)
    }

    componentWillReceiveProps(nextProps) {
        const {
            questionId,
            defalutSelectAnswer,
            defalutCheckAnswer
        } = nextProps
        this.getData(nextProps.questionId)
        this.setState({
            questionId,
            defalutSelectAnswer,
            defalutCheckAnswer
        })
    }

    render() {
        const flag = this.props.userRoleId != 3 
        return (
            <>
               <div><span style={{fontSize:16,fontWeight:'bold'}}>{this.state.questionTypeDesc}：</span>{this.state.questionName}</div>
               {
                   this.state.questionTypeId == 2
                   ?
                   <Checkbox.Group style={{ width: '100%' }} onChange={this.onCheckChange} value={flag ? this.state.selectValue : this.state.defalutCheckAnswer} disabled={flag}>
                       {
                            this.state.questionOptionList.map(
                                item => {
                                    return (<Checkbox style={radioStyle} key={item.questionOptionId} value={item.questionOptionId+""}>
                                    {item.questionOptionContent}
                                    </Checkbox>)
                                }
                            )
                       }
                       {
                            this.state.questionPicture != ""
                            ?
                            <img alt="example" style={{ width: '100%' }} src={this.state.questionPicture} />
                            :
                            ""
                       }
                   </Checkbox.Group>
                   :
                   <Radio.Group onChange={this.onRadioChange} value={flag ? this.state.selectValue : this.state.defalutSelectAnswer} disabled={flag}>
                       {
                            this.state.questionOptionList.map(
                                item => {
                                    return (<Radio style={radioStyle} key={item.questionOptionId}  value={item.questionOptionId+""}>
                                    {item.questionOptionContent}
                                    </Radio>)
                                }
                            )
                       }
                       {
                            this.state.questionPicture != ""
                            ?
                            <img alt="example" style={{ width: '100%' }} src={this.state.questionPicture} />
                            :
                            ""
                       }
                    </Radio.Group>

               }
                <div>
                    {
                        flag
                        ?
                        <span>题目解析为：{this.state.questionDescription}</span>
                        :
                        <></>
                    }
                </div>
            </>
        )
    }
}

export default Question
