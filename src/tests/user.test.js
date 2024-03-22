const Hapi = require("@hapi/hapi")
const { userRoute } = require("../routes/index.js")

//dataUser mock
const dataUser ={
    name: "test",
    email: "test@gmail.com",
    password: "123456"
}

const login = {
    email: "support@gmail.com",
    password: "123456"
}

let server

beforeAll(async () => {
    server = Hapi.server({
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

    server.route(userRoute)
    await server.start()
}) 

afterAll(async () => await server.stop())


describe("User routes", () => {

    let cookie = ""

    test ("LOGIN login user", async () => {
        const loginData = login
        const res = await server.inject({
            method: "post",
            url: "/login",
            payload: loginData
        })

        if (res.headers["set-cookie"]){
            cookie = res.headers["set-cookie"][0].split(";")[0]
        }

        expect(res.statusCode).toBe(200)
        expect(res.result).toHaveProperty("user")
    })

    test("GET Return PONG!", async () =>{
        const res = await server.inject({
            method: "get",
            url: "/",
            headers: {
                cookie: cookie
                }
                })
        expect(res.statusCode).toBe(200)
        expect(res.payload).toBe("PONG!")
    })

    test("POST creating user", async () => {
        const userData = dataUser
        const res = await server.inject({
            method: "post",
            url: "/create_user",
            payload: userData,
            headers: {
                cookie: cookie
                }
        })
        expect(res.statusCode).toBe(200)
        expect(res.result).toEqual({
            error: false,
            message: "Success"
        })
    })

    test("UPDATE update user", async () => {
        const updateData = {email: dataUser.email, name: "test update", password: dataUser.password}
        const email = dataUser.email
        const res = await server.inject({
            method: "put",
            url: `/update_user/${email}`,
            payload: updateData,
            headers: {
                cookie: cookie
                }
        })
        expect(res.statusCode).toBe(200)
        expect(res.result).toEqual({
            error: false,
            message: "User updated"
        })
    })

   

    test("DELETE delete user", async () => {
        const email = dataUser.email
        const res = await server.inject({
            method: "delete",
            url: `/delete_user/${email}`,
            headers: {
                cookie: cookie
                }
        })
        expect(res.statusCode).toBe(200)
        expect(res.result).toEqual({
            error: false,
            message: "User deleted"
        })
    })
})