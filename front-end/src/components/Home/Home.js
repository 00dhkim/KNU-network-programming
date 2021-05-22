import React,{ isValidElement, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import axios from 'axios'
//import { post } from '../../../../back-end/routes/wait';


function Home(props) {
  let payload = {
    flag : "",
    name : ""
  }

    const sendToServer = () => { 
      axios.post('http://localhost:5000/wait',payload) //이렇게 하면 되나 ??
      .then(function(response){
        console.dir(response)
        if(response.data.isStart ==true){
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
              console.log("프라이빗 처리 성공")
              console.log(response)
              payload.flag = "access"
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
    //setTimeout(useEffect,10000);    
    function redirectToLogin() {
    props.history.push('/login');
    }
    const redirectToGame = () => {
      props.updateTitle('GAME')
      props.history.push('/game'); 
  }
    return(
        <div className="mt-2">
          <span>waiting... </span>
        </div>
    )
    
}

export default withRouter(Home);