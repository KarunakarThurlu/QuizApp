
export const isLogin = () => {

    if (localStorage.getItem("Jwt") !== undefined && localStorage.getItem("Jwt") !== null) {
        return true;
    }
    return false;
}