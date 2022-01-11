const User = require("../models/UserModel");
const Role = require("../models/RoleModel");
const bcrypt = require("bcryptjs");
const JWTUtil = require("../utils/JWTUtil");
const jwt = require("jsonwebtoken");
const GetUserFromToken = require("../utils/GetUserDetailsFromToken");
const fs = require("fs");
var multer = require('multer');
const CacheService = require("../utils/CacheSerive");
const CommonConstants = require("../utils/CommonConstants");



//login
exports.login = async (request, response, next) => {
    try {
        let user = await User.findOne({ email: { $eq : request.body.email } }).populate("roles");
        if (user === null)
            return response.json({ data: request.body, statusCode: 400, "message": request.body.email + " is not Found in our database. Please signup!." });
        let validpassword = await bcrypt.compare(request.body.password, user.password);
        if (!validpassword)
            return response.json({ data: request.body, statusCode: 400, "message": "Invalid UserName Or Password!" });

        user.password = undefined;
        const token = jwt.sign({ sub: user._id }, JWTUtil.JWTCONSTANTS.CLIENT_SECRET, { expiresIn: JWTUtil.JWTCONSTANTS.TOKEN_EXPIRES_IN, issuer: JWTUtil.JWTCONSTANTS.ISSUER });
        return response.json({ data: user, statusCode: 200, message: "Login Success!", token: token });
    } catch (error) {
        console.error("########################### " + new Date().toISOString() + " While Login   ############################", error);
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
};



exports.uploadProfilePicture = async (request, response, next) => {
    const requestUser = await GetUserFromToken.getUserDetailsFromToken(request);
    try {
        const url = request.protocol + '://' + request.get('host')
        let userFromDB = await User.findOne({ _id: requestUser._id });
        if (userFromDB) {
            //delete old image
            if (userFromDB.profilePicture) {
                let oldImagePath = "uploads/" + userFromDB.profilePicture.split("uploads/")[1];
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            await User.findByIdAndUpdate({ _id: {$eq : requestUser._id } }, { $set: { profilePicture: url + '/uploads/' + request.file.filename } });
            let updatedUser = await User.findOne({ _id: requestUser._id }, { password: false }).populate('roles');
            CacheService.set(updatedUser._id.toString(), updatedUser);
            return response.json({ data: updatedUser, statusCode: 200, message: "Profile Picture Uploaded Successfully!" });
        } else {
            return response.json({ data: {}, statusCode: 400, message: "User Not Found!" });
        }
    } catch (error) {
        console.error("########################### " + new Date().toISOString() + " While Uploading profile picture   ############################", error);
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
};


exports.saveUser = async (request, response, next) => {
    try {
        let userExists = await User.findOne({ email:{ $eq: request.body.email} });
        if (userExists)
            return response.json({ data: request.body, statusCode: 400, message: `Email ${request.body.email} Already Exists` });
        let roles = [];
        if (request.body.roles.length !== 0) {
            let rolesFromUI = request.body.roles;
            for (let role of rolesFromUI) {
                let roleExisted = await Role.findOne({ role_name: { $eq : role.role_name } });
                if(roleExisted && roleExisted.role_name === 'ADMIN'){
                    const authorization = request.headers["authorization"];
                    if(authorization === undefined || authorization === null || authorization === ''){
                        return response.json({ data: {}, statusCode: 400, message: "You are not authorized to perform this action!" });
                    }
                    const requestUser = await GetUserFromToken.getUserDetailsFromToken(request);
                    if(requestUser.roles.find(roleObject => roleObject.role_name === "SUPER_ADMIN") === undefined){
                        return response.json({ data: request.body, statusCode: 400, message: "You are not authorized to create admin user!" });
                    }
                }
                if (roleExisted && roleExisted.role_name === 'SUPER_ADMIN') {
                    return response.json({ data: request.body, statusCode: 401, message: "Access Denied" });
                }
                if (roleExisted === null) {
                    const count = await Role.find().countDocuments();
                    let r = new Role({ role_name: role.role_name, roleId: count + 1 });
                    roleExisted = await r.save();
                    roles.push(roleExisted._id);
                } else {
                    roles.push(roleExisted._id);
                }
            }
        }

        let userObj = new User({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            phoneNumber: request.body.phoneNumber,
            status: request.body.status,
            password: bcrypt.hashSync(request.body.password || "user", 10),
            gender: request.body.gender,
            roles: roles
        });
       let savedUser = await userObj.save();
       savedUser.password=undefined;
        CacheService.del(CommonConstants.KEYS.USERS_VISULN);
        return response.json({ data: userObj, statusCode: 200, message: "User Saved" });
    } catch (error) {
        console.error("########################### " + new Date().toISOString() + " While Saving User   ############################", error);
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.changePassword = async (request, response, next) => {
    try {
        const requestUser = await GetUserFromToken.getUserDetailsFromToken(request);
        const userId = request.body._id===""? requestUser._id:request.body._id ;
        let userFromDB = await User.findOne({ _id: { $eq : userId } },{password:true});
        if (userFromDB) {
            if (request.body.currentPassword === null || request.body.currentPassword === undefined || request.body.currentPassword === "") {
                if (requestUser.roles.find(role => role.role_name === "SUPER_ADMIN") === undefined) {
                    return response.json({ data: request.body, statusCode: 400, message: "Current Password is Invalid!" });
                }
            } else {
                let validpassword = await bcrypt.compare(request.body.currentPassword, userFromDB.password);
                if (!validpassword)
                    return response.json({ data: request.body, statusCode: 400, message: "Current Password is Invalid!" });
            }
            await User.findByIdAndUpdate({ _id : userFromDB._id.toString()  }, { $set: { password: bcrypt.hashSync(request.body.newPassword, 10) } });
            return response.json({ data: {}, statusCode: 200, message: "Password Changed Successfully!" });
        } else {
            return response.json({ data: {}, statusCode: 400, message: "User Not Found!" });
        }
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
exports.getUserById = async (request, response, next) => {
    try {
        let user = await User.findOne({ _id: { $eq : request.query.id } }).populate('roles');
        if (user)
            return response.json({ data: user, statusCode: 200, message: "User Saved" });
        else
            return response.json({ data: {}, statusCode: 400, message: "not found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.getAllUsers = async (request, response, next) => {
    try {
        const pageNumber = parseInt(request.query.pageNumber) - 1 || 0;
        const pageSize = parseInt(request.query.pageSize) || 5;
        const totalCount = await User.find().countDocuments();
        const users = await User.find({}, { password: false }).sort({ updatedOn: -1 })
            .populate({ path: "company", select: ["name", "companyId"] })
            .populate({ path: "roles", select: ["role_name", "roleId"] })
            .skip(pageNumber * pageSize)
            .limit(pageSize);

        if (users)
            return response.json({ data: users, totalCount: totalCount, pageNumber: pageNumber, pageSize: pageSize, statusCode: 200, message: "OK" });
        else
            return response.json({ data: {}, statusCode: 400, message: "not found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.updateUser = async (request, response, next) => {
    try {
        const userFromDB = await User.findOne({ _id: { $eq:request.body._id } });
        if (userFromDB) {
            //updating user fields
            let keys = Object.keys(request.body);
            keys.map((v, i) => { userFromDB._doc[keys[i]] = request.body[v]; });
            userFromDB['updatedOn'] = new Date().toISOString();
            //updating user roles
            let roles = [];
            if (request.body.roles !== undefined && request.body.roles.length !== 0) {
                let rolesFromUI = request.body.roles;
                for (let role of rolesFromUI) {
                    let roleExisted = await Role.findOne({ role_name: { $eq : role.role_name } });
                    if (roleExisted && roleExisted.role_name === 'SUPER_ADMIN') {
                       return response.json({ data: request.body, statusCode: 401, message: "Access Denied" });
                    }
                    if (roleExisted === null) {
                        let r = new Role({ role_name: role.role_name });
                        roleExisted = await r.save();
                        roles.push(roleExisted._id);
                    } else {
                        roles.push(roleExisted.id);
                    }
                }
            }
            userFromDB.roles = roles;
            await User.findOneAndUpdate({ _id: { $eq : request.body._id } }, userFromDB);
            const user = await User.findOne({ _id: { $eq : request.body._id } }).populate('roles');
            user.password = undefined;
            CacheService.del(user._id.toString());
            CacheService.del(CommonConstants.KEYS.USERS_VISULN);
            response.json({ data: user, statusCode: 200, message: "Updated Successfully" });
        }
        else
            return response.json({ data: {}, statusCode: 400, message: "not found" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}

exports.deleteUserById = async (request, response, next) => {
    try {
        const userFromDB = await User.findOne({ _id: { $eq :request.query.id } });
        if (userFromDB) {
            //change status to INACTIVE
            await User.findByIdAndUpdate({ _id: userFromDB._id.toString() } , { $set: { status: "INACTIVE" } });
            CacheService.del(CommonConstants.KEYS.USERS_VISULN);
            return response.json({ data: {}, statusCode: 200, message: "Deleted Successfully" });
        } else {
            return response.json({ data: {}, statusCode: 400, message: "not found" });
        }
    } catch (error) {
        response.json({ data: "", statusCode: "500", message: error.message })
    }
}

exports.getUsersDataForVisualizationData = async () => {
    try {
        //get allusers groupby status
        let roles = await Role.find();
        const RolesMap = new Map();
        roles.map((v, i) => RolesMap.set(v._id.toString(), v.role_name));

        let usersStatusCount = []
        let users = await User.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        users.map((v, i) => usersStatusCount.push({ name: v._id, y: v.count }));


        let usersWithRolesCount = []
        let usersWithRoles = await User.aggregate([{ $group: { _id: "$roles", count: { $sum: 1 } } }])
            .project({ _id: 0, role_name: "$_id", count: 1 });

        usersWithRoles.map((v, i) => {
            let roleIds = v.role_name;
            if (roleIds.length === 1) {
                usersWithRolesCount.push({ name: RolesMap.get(roleIds[0].toString()), y: v.count });
            } else if (roleIds.length === 2) {
                if (RolesMap.get(roleIds[0].toString()) === 'ADMIN' || RolesMap.get(roleIds[1].toString()) === 'ADMIN') {
                    usersWithRolesCount.push({ name: "ADMIN", y: v.count });
                }
            } else if (roleIds.length === 3) {
                if (RolesMap.get(roleIds[0].toString()) === 'SUPER_ADMIN' || RolesMap.get(roleIds[1].toString()) === 'SUPER_ADMIN' || RolesMap.get(roleIds[2].toString()) === 'SUPER_ADMIN')
                    usersWithRolesCount.push({ name: "SUPERADMIN", y: v.count });
            }
        });

        return { users: usersStatusCount, usersWithRoles: [{ innerSize: '60%', name: "Role", data: usersWithRolesCount }] };

    } catch (error) {
        console.error("########################### " + new Date().toISOString() + " While Getting Users for Visualization   ############################", error);
    }
}

exports.getUsersDataForVisualization = async (request, response, next) => {

    try {
        if (CacheService.has(CommonConstants.KEYS.USERS_VISULN))
            return response.json({ data: CacheService.get(CommonConstants.KEYS.USERS_VISULN), statusCode: 200, message: "OK" });
        const res = await this.getUsersDataForVisualizationData();
        CacheService.set(CommonConstants.KEYS.USERS_VISULN, res);
        return response.json({ data: res, statusCode: 200, message: "OK" });
    } catch (error) {
        return response.json({ data: {}, statusCode: 500, message: error.message });
    }
}
