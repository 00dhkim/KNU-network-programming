import axios from "axios";
import { withRouter } from "react-router-dom";
import React, {useState} from 'react';

function UploadForm(props) {


    const [img, setImage] = useState(null);

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
    }

    return (
        <div className="UploadForm">
            <input type="file" onChange={onChange}/>
            <button onClick={onClick}>제출</button>
        </div>
    )
};

export default withRouter(UploadForm);