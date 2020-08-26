import React, { Component } from 'react'
import { Modal, Input, Select, message, Button, Row, Col, Form} from 'antd';

import {updateQuestion} from '../../requests'

const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const questionCategoryIdData = [{
  key:"1",
  value:"java"
},{
  key:"2",
  value:"驾考科目"
},{
  key:"3",
  value:"前端"
},{
  key:"4",
  value:"数据库"
},{
  key:"5",
  value:"c语言"
}]

const questionLevelIdData = [{
  key:"1",
  value:"难"
},{
  key:"2",
  value:"中"
},{
  key:"3",
  value:"易"
}]

@Form.create()
class EditMod extends Component {
    constructor(){
        super()
        this.state = ({
          defVal:"",
          questionName:"",
          questionOptionList:[],
          questionAnswerOptionIds:"",
          questionTypeId:"",
          questionCategoryId:"",
          questionLevelId:"",
          questionDescription:""
        })
    }
    
    componentWillReceiveProps(nextProps){
      this.setState({
        questionName:nextProps.record.questionName,
        questionOptionList:nextProps.record.questionOptionList,
        defVal:nextProps.defVal,
        questionAnswerOptionIds:nextProps.record.questionAnswerOptionIds,
        questionTypeId:nextProps.record.questionTypeId,
        questionCategoryId:nextProps.record.questionCategoryId,
        questionLevelId:nextProps.record.questionLevelId,
        questionDescription:nextProps.record.questionDescription
      })
    }

    hideOkModal = ()=>{
      if(null == this.state.questionName || "" == this.state.questionName){
        message.error("题目名不能为空")
      }else{
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.setState({
              questionCategoryId:values.questionCategoryId,
              questionLevelId:values.questionLevelId,
              questionDescription:values.questionDescription
            },()=>{
              this.updateQuestion(values.questionCategoryId, values.questionLevelId, values.questionDescription)
            })
          }
        })
        
      }
    }
    
    updateQuestion = (questionCategoryId, questionLevelId, questionDescription) => {
      const questionName = this.refs.questionName.state.value
      updateQuestion(this.props.record.questionId,this.props.record.questionAnswerOptionIds,questionName,this.state.questionOptionList,
        questionCategoryId,questionLevelId,questionDescription
        )
        .then(resp =>{
          message.success("更新成功");
          this.props.hideModal();
        })
        .catch(res =>{
          message.error("更新失败");
          this.props.hideModal();
        })
    }

    hideCancelModal = () => {  
      this.props.hideModal();
    }

    //如果答案的id变化时,将其更换答案的id
    handleChange = (e,a) => {
        this.setState({
          defVal:e
        })
        if(a.length != null){
          var str = ""
          for(var i = 0;i < a.length;i++){
            str += a[i].key + "-";
          }
          str = str.substr(str,str.length-1);
          this.props.record.questionAnswerOptionIds = str;
        }else{
          this.props.record.questionAnswerOptionIds = a.key;
        }
    }

    handleTextArea = (e) => {
      this.setState({
        questionName:e.target.value
      })
    }

    handleInputChange = (index,e) => {
      //通过id查出value,看是否在答案中,在则将其替换掉
      const questionOptionList = this.state.questionOptionList;
      const val = questionOptionList[index].questionOptionContent;
      var  vals = this.state.defVal;

      //再确定是多选还是单选//在答案中
      if(vals instanceof Array){
          vals[vals.indexOf(val)] = e.target.value
      }else if( vals == val){
          vals = e.target.value
      }

      questionOptionList[index].questionOptionContent = e.target.value;
      this.setState({
        questionOptionList,
        defVal:vals
      })
    }

    render() {
      const item = this.props.record;
      const { getFieldDecorator } = this.props.form;
      return (
          <Modal
            title={this.props.type == "详情" ? "查看题目详情" : "编辑题目"}
            visible={this.props.visible}
            onOk={this.hideOkModal}
            onCancel={this.hideCancelModal}
            destroyOnClose={true}
            okText="确认"
            cancelText="取消"
            footer = {this.props.type == "详情" ? null :(
              [
                <Button key="back" type="primary" onClick={this.hideOkModal}>
                  确定
                </Button>,
                <Button key="submit"   onClick={this.hideCancelModal}>
                  取消
                </Button>,
              ]
            )}
          >
            <h3>
              题目:
              <TextArea
                ref="questionName"
                style={ {
                  height: 50,
                  padding:0,
                }}
                disabled = {
                  this.props.type == "详情" ? true : false
                }
                defaultValue={this.state.questionName}
                onChange={this.handleTextArea}
              ></TextArea>
            </h3>
            {
              item.questionPicture != ""
              ?
              <img alt="example" style={{ width: '100%' }} src={item.questionPicture} />
              :
              ""
            }
            
            {
              item.questionName != null
              ?
              (
                <>
                <ul  style={{padding:0 ,marginBottom:0}}>
                  {
                    this.state.questionOptionList.map((ques, index) => {
                      return (<li key={ques.questionOptionId}>
                            <Input disabled={(this.props.type == "详情" || this.state.questionTypeId == 3) ? true : false} ref="questionOption" key={ques.questionOptionId} defaultValue={ques.questionOptionContent} onChange={this.handleInputChange.bind(this,index)}/>
                        </li>
                      )
                    })
                  }
                </ul>
                <h4>答案：</h4>
                <ul style={{padding:0 ,marginBottom:0}}  
                >
                    <li key={item.questionOptionId}>
                      <Select
                        mode={item.questionTypeId == 2 ? "multiple":""}
                        style={{ width: '100%' }}
                        value={this.state.defVal}
                        onChange={this.handleChange}
                        disabled = {
                          this.props.type == "详情" ? true : false
                        }
                      >
                        {
                          this.state.questionOptionList.map(ques => {
                                return (
                                      <Option key={ques.questionOptionId} value={ques.questionOptionContent} id={ques.questionOptionId}>{ques.questionOptionContent}</Option>    
                                )
                          })
                        }
                      </Select>
                    </li>
                </ul>
                {/* style={{marginLeft:'20px',marginBottom:'20px'}} */}
                <Form {...layout} name="nest-messages">
                  {
                    this.props.type == "详情"
                    ?
                    ""
                    :
                    
                    <><Form.Item  style={{ textAlign: 'left'}} label="题目科目">
                            {getFieldDecorator('questionCategoryId', {
                                initialValue: this.state.questionCategoryId
                            })(<Select initialValue="" placeholder="选择科目" onChange={this.handleCategoryChange}>
                            {
                                questionCategoryIdData.map(res =>{
                                return ( <Option key={res.key} value={res.key}>{res.value}</Option>)
                                })
                            }
                            </Select>)}
                    </Form.Item>
                    <Form.Item  style={{ textAlign: 'left'}} label="题目难度">
                            {getFieldDecorator('questionLevelId', {
                              initialValue: this.state.questionLevelId
                            })(<Select initialValue="" placeholder="选择题目难度" onChange={this.handleCategoryChange}>
                            {
                                questionLevelIdData.map(res =>{
                                return ( <Option key={res.key} value={res.key}>{res.value}</Option>)
                                })
                            }
                            </Select>)}
                    </Form.Item>
                    </>
                  }
                     
                    <Form.Item  style={{ textAlign: 'left'}} label="题目解析">
                            {getFieldDecorator('questionDescription', { 
                              rules: [
                                    {
                                        required: true,
                                        message: '请输入题目解析',
                                    },
                                ],
                                initialValue: this.state.questionDescription
                            })(<TextArea rows={4} disabled = {
                              this.props.type == "详情" ? true : false
                            }/>)}
                    </Form.Item>     
                </Form>
                </>
              )
              :
              <></>
            }
          </Modal>
      );
    }
  }

  export default EditMod;