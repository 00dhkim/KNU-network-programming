import React, {useState} from 'react'; //useState : 상태변수 값이 react.js 에서 동적으로 업데이트 될 수 있는 변수
import axios from 'axios';
import './RegistrationForm.css';
import {ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";

function RegistrationForm(props) {
    const [state , setState] = useState({//filed value 초기화
        id : "",
        name : "",
        password : "",
        confirmPassword: "",
        successMessage: null
    })
    const handleChange = (e) => { //값을 업데이트하는 함수
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const sendDetailsToServer = () => { 
        if(state.name.length && state.password.length && state.id.length) {
            //props.showError(null);
            const payload={
                "id":state.id,
                "passwords":state.password,
                "name" : state.name,
                'successMessage' : 'Registration successful'
            }
            
            console.log("회원가입 시도")
           // redirectToLogin(); //일단 회원가입 누르면 바로 로그인 화면으로 가게함
            axios.post('http://localhost:5000/addUser', payload)
                .then(function (response) {
                    console.dir(response)
                    
                    if(response.data.result) {
                        // 회원가입 성공

                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Redirecting to home page..'
                        }))
                        localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token); //backend에서 받은 토큰을 브라우저의 로컬 저장소에 저장.
                        redirectToLogin();
                        props.showError(null)
                    }
                    else {
                        // 회원가입 실패

                        props.showError("fail to register");

                    }
                })
                .catch(function (error) {
                    console.log(error);
                });   

        } else {
            props.showError('Please enter valid username and password')    
        }
        
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.password === state.confirmPassword) { //암호 입력이 일치하는지
            sendDetailsToServer()  //backend API요청 수행  
        } else {
            props.showError('Passwords do not match');
        }
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Name</label>
                <input type="name" 
                       className="form-control" 
                       id="name" 
                       placeholder="Enter name" 
                       value={state.name}
                       onChange={handleChange}
                />
                </div>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">ID</label>
                <input type="id" 
                       className="form-control" 
                       id="id" 
                       placeholder="id" 
                       value={state.id}
                       onChange={handleChange}
                />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick} 
                >
                    Register
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
            
        </div>
    )
}

export default withRouter(RegistrationForm);