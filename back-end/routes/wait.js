// router
var express = require('express');
var router = express.Router();

// middleware
var bodyParser = require('body-parser');


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
        flag = req.body.flags;

        if(flag === "exit") {
            json.strPeople.splice(json.strPeople.indexOf(req.body.name), 1);
            json.numPeople = json.numPeople - 1;
        }

        if(flag === "access") {
            json.numPeople = json.numPeople + 1;
            json.strPeople.push(req.body.name);
        }

        if(json.numPeople === 3) {
            json.isStart = true;
        }

        res.json(json);
    }
)

// get






// export
module.exports = router;