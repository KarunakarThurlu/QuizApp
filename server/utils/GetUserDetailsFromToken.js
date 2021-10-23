const User = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const NodeCache = require("node-cache");
const CacheService = require("../utils/CacheSerive");


exports.getUserDetailsFromToken = async (request) => {
   // console.info("########################### " + new Date().toISOString() + " Enter into getUserName from Token method ############################")
    let bearerToken = request.headers["authorization"].split(" ")[1];
    let decodedtoken = jwt.decode(bearerToken);
    let user = {};
    if (CacheService.has(decodedtoken.sub)) {
        user =  CacheService.get(decodedtoken.sub);
        console.log("Getting LoggedIn User Information From Cache");
    } else {
        user = await User.findOne({ _id: decodedtoken.sub }).populate("roles");
        CacheService.set(decodedtoken.sub, user, 60 * 60 * 1);
    }
    //console.info("########################### " + new Date().toISOString() + " Exit  Of getUserName from Token method  ############################")
    return user !== null ? user._doc : null;
}