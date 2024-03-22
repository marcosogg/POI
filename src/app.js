const Hapi = require("@hapi/hapi")

// start routes
const { userRoute, categoryRoute, pointRoute, analyticsRoute } = require("./routes/index.js")

const init = async () => {
    const server = Hapi.server({
        port: 8081,
        host: "localhost"
    })


    await server.register(require("@hapi/cookie"))

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'poi-cookie',
            password: 'kqvcya/+t!8NozLMM`9W8I+e3QzK9@LR',
            isSecure: false
        }
    })

    server.auth.scheme("session", () => {
        return {
            authenticate: async (req, res) => {
                const session = req.state.poi - cookie

                if(!session.isValid){
                    throw res.unauthenticated("Session is invalid")
                }
                return res.authenticated({credentials: session})
            }

        }
    })

    server.auth.default("session")

      // routes
      server.route(userRoute)
      server.route(categoryRoute)
      server.route(pointRoute)
      server.route(analyticsRoute)


await server.start()
console.log("Server running ...", server.info.uri)

}

init()