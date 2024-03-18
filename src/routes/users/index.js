const userRoute = [
    {
        method: "GET",
        path: "/",
        handler: (request, h) => {
            return "User Route"
        }
    }
]

module.exports = userRoute
