import localforage from "localforage";

const config = {
    Base_URL: "http://localhost:3001",
    ImagesBase_URL: "http://localhost:3001/uploads/",
    LOCAL_FORAGE: localforage.createInstance({ name: "javaQ" }),
}
export default config;