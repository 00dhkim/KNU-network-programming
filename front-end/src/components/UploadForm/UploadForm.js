import axios from "axios";
import { withRouter } from "react-router-dom";
import React, {useState} from 'react';
import ReactDOM from 'react-dom'
import { useEffect } from "react";

function UploadForm(props) {


    const [img, setImage] = useState(null);

    let [num, setNum] = useState(null);

    const onChange = (e) => {
        setImage(e.target.files[0]);
    }

    const onClick = async () => {
        const formData = new FormData();
        formData.append('file', img);
        console.dir(formData);
        // 서버의 upload API 호출
        const res = await axios.post("http://localhost:5000/upload", formData);
        console.log(res);

        let ml_res = await axios.get("http://localhost:5000/ml");
        console.dir(ml_res.data);
        setNum(ml_res);
    }

    useEffect(() => {
        document.getElementById('texterea').value = num?.data;
    })

    return (
        <div>
            <div className="UploadForm">
                <input type="file" onChange={onChange}/>
                <button onClick={onClick}>제출</button>
            </div>
            {/* <button onClick={update}>가져오기</button> */}
            <textarea id='texterea'></textarea>
        </div>
    )
};

export default withRouter(UploadForm);