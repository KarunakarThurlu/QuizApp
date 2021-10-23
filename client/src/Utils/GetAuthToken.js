
import config from "../ApiCalls/Config";

const GetAuthToken = async () => {
    let token = "";
    await config.LOCAL_FORAGE.getItem("token")
        .then((value) => {
            token = value;
        })
        .catch(function (err) {
            console.log(err);
        });
    return token;
}
export default GetAuthToken;