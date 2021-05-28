import axios from "axios";
import { withRouter } from "react-router-dom";
import React, {useState} from 'react';

function Result(props) {

    let res;

    axios.get("http://localhost:5000/ml")
    .then(function(response) {
        console.log(response);
        res = response;
    })

    return (
        <div>
            <span>result:</span>
            <span>{res}</span>
        </div>
    )
};

export default withRouter(Result);