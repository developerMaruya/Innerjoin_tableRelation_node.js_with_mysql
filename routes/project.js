const express=require('express')
const router=express.Router();

const {getLeftRightJoin,customerdetils}=require("../controllers/project")
router.route('/get_left_right_join').get(getLeftRightJoin)
router.route('/customer/:id').get(customerdetils)

module.exports=router;