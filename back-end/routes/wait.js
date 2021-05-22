// router
const express = require('express');
const router = express.Router();

// middleware
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));           
router.use(bodyParser.json());   

let names = new Array();
let json = {
    numPeople : 0,
    strPeople : names,
    isStart : false
}

//post
router.route('/').post(
    (req, res) => {
        console.log(req.body);
        console.dir(json);
        flag = req.body.flag;

        json.isStart = false;
        if(flag == "exit") {
            json.strPeople.splice(json.strPeople.indexOf(req.body.name), 1);
            json.numPeople = json.numPeople - 1;
        }

        if(flag == "access") {
            json.numPeople = json.numPeople + 1;
            json.strPeople.push(req.body.name);
        }

        if(json.numPeople == 3) {
            json.numPeople = 0;
            json.strPeople = [];
            json.isStart = true;
        }

        res.json(json);
    }
)

// get

// token 관련 테스트 코드





// export
module.exports = router;