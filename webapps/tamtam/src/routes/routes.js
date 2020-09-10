import Login from "../components/login";
import Logout from "../components/logout";
import Root from "../components/root";
import Signin from "../components/signin";
import Signout from "../components/signout";
import Signup from "../components/signup";
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
        "component": Signup,
        "path": "/signup",
        "exact": true
    },
    {
        "component": Signout,
        "path": "/signout",
        "exact": false
    },
    {
        "component": Login,
        "path": "/login/:action",
        "exact": true
    },
    {
        "component": Logout,
        "path": "/logout",
        "exact": true
    }
];