import React,{ isValidElement, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import axios from 'axios'
import {useState} from 'react';
import Cookies from 'universal-cookie';

function Home(props) {
  let payload = {
    flag : "",
    name : ""
  }
    const [title, updateTitle] = useState(null);
    const sendToServer = () => { 
      axios.post('http://localhost:5000/wait',payload) 
      .then(function(response){
       // console.dir(response)
        payload.flag = "wait"
        clearInterval(sendToServer)
        if(response.data.isStart ==true){
         // console.log("letgo")
          clearInterval(sendToServer)
          redirectToGame();
        }
      })
      .catch(function(error){
        console.log(error);
      });
      
    }
    useEffect(() => {
          axios.post("http://localhost:5000/wait", { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
          .then(function (response) {
            if(response.status == 200) {
              props.updateTitle('Home')
              console.log("프라이빗 처리 성공")
              payload.flag = "access"
              const msg = document.cookie;
              const name = msg.split(";");
              console.log(name)
              payload.name = name[0].substring(5)
              sendToServer()
            }
            else {
              console.log(response.data.result)
              console.log(response.status)
              redirectToLogin()
              console.log("무언가 문제있음")
            }
          })
          .catch(function (error) {
            redirectToLogin()
          });
          
        })
  setInterval(sendToServer,10000);    
    function redirectToLogin() {
      props.updateTitle('Login')
      props.history.push('/login');
    }
    function redirectToGame () {
      props.updateTitle('GAME');
      props.history.push('/game'); 
  }
    return(
        <div className="mt-2">
          <span>waiting... </span>
        </div>
    )
    
}

export default withRouter(Home);