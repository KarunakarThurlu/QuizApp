const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const JWTConfig = require("../config/JWTConfig");
var multer = require('multer');
const fs = require("fs");
const path = require("path");

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var dirName = path.join(process.cwd(), './uploads/')
        console.log(dirName)
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
        cb(null, dirName)
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()+file.originalname);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    fileFilter: fileFilter,
});

router.post("/login", userController.login);
router.post("/saveuser", userController.saveUser);
router.get("/getuser", JWTConfig.verify, [JWTConfig.AdminOrUser], userController.getUserById);
router.get("/getallusers", JWTConfig.verify, [JWTConfig.AdminOrSuperAdmin], userController.getAllUsers);
router.put("/updateuser",JWTConfig.verify, userController.updateUser);
router.put("/changepassword",JWTConfig.verify,userController.changePassword)
router.delete("/deleteuser", JWTConfig.verify, [JWTConfig.SuperAdmin], userController.deleteUserById);
router.post("/uploadprofilepic",JWTConfig.verify, upload.single('image'), userController.uploadProfilePicture);
router.get("/getusersdataforvisualization",JWTConfig.verify,[JWTConfig.AdminOrSuperAdmin], userController.getUsersDataForVisualization);
module.exports = router;
