const express = require("express");
const router = express.Router();
const billController = require("../controllers/BillController");

router.post("/createBills", billController.createBill);
router.get("/getAllBills", billController.getAllBills);
router.delete("/deleteBill/:id", billController.deleteBill);
router.get("/billDetail/:id", billController.getBillDetails);

module.exports = router;
