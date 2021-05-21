import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import axios from 'axios'
function Home(props) {
    useEffect(() => {
        axios.post("http://localhost:5000/wait")
          .then(function (response) {
            // 로직 알아서

            console.log(response)
            
          })
        })

// token 관련 테스트 코드
    useEffect(() => {
          axios.get("http://localhost:5000/wait", { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
          .then(function (response) {
            
            if(response.data.isPrivate) {
              console.log("프라이빗 처리 성공")
            }
            else {
              redirectToLogin()
              console.log("무언가 문제있음")
            }

              // if(response.status !== 200){
              //  
              // }
          })
          .catch(function (error) {
            redirectToLogin()
          });
        })
        
    function redirectToLogin() {
    props.history.push('/login');
    //props.updateTitle('Login');
    }
    return(
        <div className="mt-2">
          <span>waiting... </span>
        </div>
    )
}

export default withRouter(Home);