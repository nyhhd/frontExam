import actionTypes from './actionTypes'
import { loginRequest ,logouting} from '../requests'

const startLogin = () => {
    return {
        type:actionTypes.START_LOGIN
    }
}

const loginSuccess = (userInfo) =>{
    return {
        type:actionTypes.LOGIN_SUCCESS,
        payload: {
            userInfo
        }
    }
}

export const logout = () => {
    return dispatch => {
      // 实际的项目中，在这里要告诉服务端用户退出
      dispatch(loginFailed())
      logouting().then(resp =>{

      })
    }
}

const loginFailed = () =>{
    window.localStorage.removeItem('authToken')
    window.sessionStorage.removeItem('authToken')
    window.localStorage.removeItem('userInfo')
    window.sessionStorage.removeItem('userInfo')
    return {
        type:actionTypes.LOGIN_FAILED
    }
}

export const login = (values) => {
    return dispatch => {
        dispatch(startLogin())
        loginRequest(values.username,values.password)
            .then(resp =>{
                if(undefined != resp || null != resp){
                    if(resp.code === 200){
                        if (values.remember === true) {
                            window.localStorage.setItem('authToken', resp.token)
                            window.localStorage.setItem('userInfo', JSON.stringify(resp.data))
                        } else {
                            window.sessionStorage.setItem('authToken', resp.token)
                            window.sessionStorage.setItem('userInfo', JSON.stringify(resp.data))
                        }
                        dispatch(loginSuccess(resp.data))
                    }else{
                        dispatch(loginFailed())
                    }
                }
            })
    }
}