const {schemaCategory, schemaCategoryUpdate, schemaCategoryDelete} = require("../../controller/category/index.js")
const AnalyticsData = require("../../services/analytics/index.js")

const client = new AnalyticsData()

const categoryRoute = [
    {
        method: "GET",
        path: "/analytics",
        handler: async (request, h) => {

            const analytics = await client.qtyByCategory()
            return {
                error: false,
                message: "Success",
                analytics
            }
        }
    },
   
]

module.exports = categoryRoute
