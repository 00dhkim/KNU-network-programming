const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

fs.readdir('uploads', (error) => {
    if(error) {
        fs.mkdirSync('uploads');
    }
})

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            // cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
            cb(null, 'image' + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})

// 이미지 업로드를 위한 API
// upload의 single 메서드는 하나의 이미지를 업로드할 때 사용
router.post('/', upload.single('file'), (req, res) => {
    // console.log("upload invoked by POST");
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
})

// router.get('/', (req, res) => {
//     console.log("upload invoked by GET");
//     res.send("upload invoked by GET");
// })

module.exports = router;