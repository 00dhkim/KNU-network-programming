import React,{ isValidElement, useEffect ,useRef} from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import axios from 'axios'
import {useState} from 'react';
import Cookies from 'universal-cookie';

function Home(props) {
  let payload = {
    flag : "",
    name : ""
  }
  function useInterval(callback, delay) {
      const savedCallback = useRef();
  
    // Remember the latest callback.
      useEffect(() => {
        savedCallback.current = callback;
        }, [callback]);
  
    // Set up the interval.
       useEffect(() => {
        function tick() {
          savedCallback.current();
        }
        if (delay !== null) {
          let id = setInterval(tick, delay);
          return () => clearInterval(id);
        }
      }, [delay]);
    }

    const sendToServer =()=>{ 
      axios.post('http://localhost:5000/wait',payload) 
      .then(function(response){
        //console.dir(response)
        payload.flag = "wait"
        if(response.data.isStart ==true){
         // console.log("letgo")
         redirectToGame();
          return() => clearInterval(sendToServer)
          
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
              sendToServer();
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
        },[])
        // useInterval(()=>{
        //   sendToServer();
        // },10000)
  setInterval(sendToServer,10000);    
    function redirectToLogin() {
      props.updateTitle('Login')
      props.history.push('/login');
    }
    function redirectToGame () {
      props.updateTitle('GAME');
      props.history.push('/game'); 
  }
  function redirectToHome () {
    props.updateTitle('Home');
    props.history.push('/home'); 
}
    return(
        <div className="mt-2">
          <span>waiting... </span>
        </div>
    )
    
}

export default withRouter(Home);