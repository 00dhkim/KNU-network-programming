import React, {useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import { ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";

function LoginForm(props) {
    const [state , setState] = useState({
        id : "",
        password : "",
        successMessage: null
    })
    props.updateTitle('Login')
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value

        }))
    }
    const handleSubmitClick = async(e) => {
        e.preventDefault();
        const payload = {
            "id" : state.id,
            "passwords" : state.password,
            "successMessage" : "Success"
        };
        
        axios.post('http://localhost:5000/login', payload)
            .then(function (response){ 
                if(response.data.result) {
                    // 로그인 성공일 시
                    
                    console.log("login success")
                    let name = response.data.name;
                    console.log(name)
                    alert(name+"님 반갑습니다.");

                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.result);
                    redirectToHome();
                    props.showError(null)
                }
                else {
                    // 로그인 실패일 시
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.result);
                    props.showError("login failed");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInput">ID</label>
                <input type="id" 
                       className="form-control" 
                       id="id"  
                       placeholder="Enter ID" 
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
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
            </div>
        </div>
    )
}

export default withRouter(LoginForm);