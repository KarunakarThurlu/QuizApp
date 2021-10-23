const Commpany = require("../models/CompanyModel");


exports.saveCompany = async (request, response, next) => {
    try {
        const company = new Commpany({
            name: request.body.name,
            creationDate: new Date().toISOString(),
            companySize: 20
        });
        let savedcompany = await company.save();
        return response.json({ data: savedcompany, statusCode: 200, message: "OK" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }

}