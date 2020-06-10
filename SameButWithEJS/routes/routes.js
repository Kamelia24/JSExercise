const express = require('express');
const router = express.Router();
const controller=require('../controllers/controller.js');
const userController=require('../controllers/userController.js');
router.get('/',controller.home); 
router.get('/register',userController.register); 
router.get('/login',userController.login); 
router.get('/quiz',controller.getQuiz); 
router.get('/logOut',userController.logOut);
router.post("/sort",controller.sortQuiz);
router.post("/addUser",controller.addUserScore);
router.post("/addUserData",userController.newUser);
router.post("/checkUserData",userController.logInVerify);
router.get("/profile",userController.profileInfo);
module.exports = router;
