import Login from "../components/login";
import Root from "../components/root";
import Signin from "../components/signin";
export default [
    {
        "component": Root,
        "path": "/",
        "exact": true
    },
    {
        "component": Signin,
        "path": "/signin",
        "exact": true
    },
    {
        "component": Login,
        "path": "/login/:action",
        "exact": true
    }
];