const express = require('express');
const router = express.Router();
const controller=require('../controllers/controller.js');
router.get('/',controller.home); 
router.get('/register',controller.register); 
router.get('/login',controller.login); 
router.get('/quiz',controller.getQuiz); 
router.get('/logOut',controller.logOut);
router.post("/sort",controller.sortQuiz);
router.post("/addUser",controller.addUserScore);
router.post("/addUserData",controller.newUser);
router.post("/checkUserData",controller.logInVerify);
router.get("/profile",controller.profileInfo);
module.exports = router;
