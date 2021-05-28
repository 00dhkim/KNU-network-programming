import React from 'react';
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import LoginForm from '../LoginForm/LoginForm';
import axios from 'axios'

function Header(props) {
    let payload = {
        flag : "",
        name : ""
      }
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    if(props.location.pathname === '/') {
        title = 'Welcome'
    }
    function renderLogout() {
        if(props.location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            )
        }
    }
    const sendToServer = () => { 
        axios.post('http://localhost:5000/wait',payload)
        .then(function(response){
          console.dir(response)
          console.dir(response.data.name)
        })
        .catch(function(error){
          console.log(error);
        });
        props.history.push('/login')
      }
    function handleLogout() {
      var setCookie = function(name,value,userid,value2) {
        document.cookie =name + '='+value+' '+userid+ '=' + value2+';path=/'+';maxAge=0 ';
        console.log(document.cookie)
    };
      console.log(localStorage)
        localStorage.removeItem(ACCESS_TOKEN_NAME)
      .then(function(response){
        console.dir(response)
      })
      .catch(function(error){
        console.log(error);
      });
      setCookie("name"," ","userid"," ");
     payload.flag = "exit"
      sendToServer()
        
        
    }
    return(
        <nav className="navbar navbar-dark bg-primary">
            <div className="row col-12 d-flex justify-content-center text-white">
                <span className="h3">{props.title || title}</span>
                {renderLogout()}
            </div>
        </nav>
    )
}
export default withRouter(Header);