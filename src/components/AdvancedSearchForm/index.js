import { Form, Row, Col, Input, Button, Icon, Select} from 'antd';
import './index.less';
import React, { Component } from 'react'

const { Option } = Select;
class AdvancedSearchForm extends Component {
  constructor(props){
    super(props);
  }

  state = {
    expand: false,
    flag:false
  };

  componentDidMount(){
    if(this.props.dataSource.length < 3){
      this.setState({
        flag:true
      })
    }
  }
  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 5 : 4;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    children.push(
        this.props.dataSource.map(
          item => {
            return (
              <Col span={8} key={item.id} style={{ display: item.id < count ? 'block' : 'none' }}>
                {
                  item.flag
                  ?
                  (
                    <Form.Item label={item.labelName}>
                      {getFieldDecorator(item.fieldName, {
                        
                        })(<Input placeholder={item.desc} />)
                      }
                    </Form.Item>
                  )
                  :
                  (
                    <Form.Item label={item.labelName}>
                        {getFieldDecorator(item.fieldName, {
                          })(<Select initialValue="">
                            {
                                item.data.map(res =>{
                                return ( <Option key={res.key} value={res.key}>{res.value}</Option>)
                                })
                            }
                          </Select>)
                            
                        }
                    </Form.Item>
                  )
                }
                 
              </Col>
            )
          }
        )
      
    );
    return children;
  }

  /* 点击搜索后的处理函数*/
  handleSearch = e => {
    e.preventDefault();
    //进行文本校验
    this.props.form.validateFields((err, values) => {
      //这里能拿到对应的值
      this.props.handleSearch(values);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  render() {
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清除
            </Button>
           
            <a style={this.state.flag ? {display : 'none',marginLeft: 8 ,fontSize : 12} : {marginLeft: 8 ,fontSize : 12} } onClick={this.toggle}>
              折叠 <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

export default WrappedAdvancedSearchForm;