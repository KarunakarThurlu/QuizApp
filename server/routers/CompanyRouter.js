const express = require("express");
const router = express.Router();
const companyController = require("../controllers/CompanyController");


router.post("/savecompany", companyController.saveCompany);


module.exports = router;