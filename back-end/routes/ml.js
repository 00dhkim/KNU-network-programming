// import { PythonShell } from 'python-shell'

// router
const express = require('express');
const router = express.Router();
const PythonShell = require('python-shell').PythonShell

router.get("/", (req, res) => {

    console.log('ml.js invoked')
    
    const option = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: './ml-server/',
        args: ''
    }

    PythonShell.run('predict.py', option, (err, results) => {
        if(err) throw err;
        res.send(results[0]);
        console.log(results[0]);
    })
})

// router.route('/').get(
//     function (req, res) {
//         console.log("ml server invoked");
        
//         res.send("ml server invoked");
//     }
// )


module.exports = router;