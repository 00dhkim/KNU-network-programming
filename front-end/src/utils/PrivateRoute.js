import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../constants/apiConstants';
function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          localStorage.getItem(ACCESS_TOKEN_NAME) ? ( //브라우저의 로컬 저장소에 access-token이 있는지 확인. 토큰이 있으면 요청 된 구성요소/rounte에 대한 엑세스 권한이 부여되고, 그렇지 않으면 사용자가 로그인 페이지로 리디렉션
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default PrivateRoute;