const express = require("express");
const router = express.Router();
const billController = require("../controllers/BillController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

router.post(
  "/createBills",
  verifyTokenCus(["admin", "staff"]),
  billController.createBill
);

router.get(
  "/getAllBills",
  verifyTokenCus(["admin", "staff"]),
  billController.getAllBills
);

router.get(
  "/getAllBillsLimit",
  verifyTokenCus(["admin", "staff"]),
  billController.getAllBillsLimit
);

router.delete(
  "/deleteBill/:id",
  verifyTokenCus(["admin", "staff"]),
  billController.deleteBill
);
router.get(
  "/billDetail/:id",
  verifyTokenCus(["admin", "staff"]),
  billController.getBillDetails
);
router.post(
  "/sendMail",
  verifyTokenCus(["admin", "staff"]),
  billController.sendEmail
);

router.get("/search/:billId", billController.searchBillById);

module.exports = router;
