const jwt = require('jsonwebtoken');
const GetUserFromToken = require("../utils/GetUserDetailsFromToken");
const JWTUtil = require("../utils/JWTUtil");



exports.verify = async (request, response, next) => {
    try {
        let bearerToken = request.headers["authorization"];
        if (bearerToken === undefined)
            return response.json({ "data": {}, "statusCode": "401", "message": "Token not present" });
        const token = bearerToken.split(" ")[1];
        jwt.verify(token, process.env.CLIENT_SECRET);
        next();
    } catch (error) {
        return response.json({ "data": {}, "statusCode": "500", "message": error.message });
    }
}


exports.AdminOrUser = async (request, response, next) => {
    let user = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        if (user !== null) {
            if (user.roles.some(role => role.role_name === "ADMIN" || role.role_name === "USER")) {
                next()
            } else {
                return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
            }
        } else {
            return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
        }
    } catch (error) {
        return response.json({ "data": {}, "statusCode": 500, "message": error.message })
    }

}
exports.AdminOrSuperAdmin = async (request, response, next) => {
    let user = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        if (user !== null) {
            if (user.roles.some(role => role.role_name === "ADMIN" || role.role_name === "SUPER_ADMIN")) {
                next()
            } else {
                return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
            }
        } else {
            return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
        }
    } catch (error) {
        return response.json({ "data": {}, "statusCode": 500, "message": error.message })
    }

}
exports.User = async (request, response, next) => {
    let user = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        if (user !== null) {
            if (user.roles.some(role => role.role_name === "USER")) {
                next()
            } else {
                return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
            }
        } else {
            return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
        }
    } catch (error) {
        return response.json({ "data": {}, "statusCode": 500, "message": error.message })
    }
}
exports.Admin = async (request, response, next) => {
    let user = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        if (user !== null) {
            if (user.roles.some(role => role.role_name === "ADMIN")) {
                next()
            } else {
                return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
            }
        }
    } catch (error) {
        return response.json({ "data": {}, "statusCode": 500, "message": error.message })
    }

}
exports.SuperAdmin = async (request, response, next) => {
    let user = await GetUserFromToken.getUserDetailsFromToken(request);
    if (user.roles.some(role => role.role_name === "SUPER_ADMIN")) {
        next()
    } else {
        return response.json({ "data": {}, "statusCode": 401, "message": "Access Denied" })
    }
}
