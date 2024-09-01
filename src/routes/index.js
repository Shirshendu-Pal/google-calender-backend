const express = require('express');
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const routes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path : "/user",
        route : userRoutes
    }
]



routes.forEach((obj) => {
    router.use(obj.path, obj.route);
});

module.exports = router;