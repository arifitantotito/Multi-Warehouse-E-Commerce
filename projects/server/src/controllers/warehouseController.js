//import sequelize
const { sequelize } = require('../models')
const { Op } = require('sequelize')


const db = require('../models/index')
const axios = require('axios')

module.exports = {
    getDataWH: async (req, res) => {
        let { page, inputSearch } = req.query
        var page_size = 4;
        var offset = (page - 1) * page_size;
        var limit = page_size;

        var total_count = await db.location_warehouse.count({  where: {
            [Op.or]: [
                { province: { [Op.startsWith]: inputSearch } },
                { city: { [Op.startsWith]: inputSearch } },
                { subdistrict: { [Op.startsWith]: inputSearch } }
            ]
        }})
        var total_pages = Math.ceil(total_count / page_size)


        let getWH = await db.location_warehouse.findAll({
            where: {
                [Op.or]: [
                    { province: { [Op.startsWith]: inputSearch } },
                    { city: { [Op.startsWith]: inputSearch } },
                    { subdistrict: { [Op.startsWith]: inputSearch } }
                ]
            }, offset, limit
        })

        res.status(201).send({
            isError: false,
            message: 'get data success',
            data: {
                getWH,
                total_count,
                total_pages, page_size
            }
        })
    },
    getEmptyWH: async (req, res) => {
        let getWH = await db.location_warehouse.findAll({
            include: [{ model: db.admin }]
        })
        console.log(getWH[6].dataValues.admin == null)
        let loader = getWH.filter((item) => item.dataValues.admin == null)
        // getWH.forEach(item=>item.dataValues.admin==null?loader.push(item.admin):null)


        res.status(201).send({
            isError: false,
            message: 'Get Data Success!',
            data: loader
        })

    },
    addWH: async (req, res) => {
        let { province, city, subdistrict, address, city_id, province_id } = req.body


        let jalan = `${address} ${subdistrict} ${city} ${province}`
        console.log(jalan)

        let response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${jalan}&key=f3582c716b9f443a9d260569d39b1ac3`)
        // console.log(response.data.results[0].geometry.lat)
        // console.log(response.data.results[0].geometry.lng)
        let dataWH = await db.location_warehouse.create({
            province, city, subdistrict, address, latitude: response.data.results[0].geometry.lat, longitude: response.data.results[0].geometry.lng, city_id, province_id
        })
        res.status(201).send({
            isError: false,
            message: 'Create Data WH Success!',
            data: dataWH
        })
    },
    updateWH: async (req, res) => {
        let { id, province, city, subdistrict, address, city_id, province_id } = req.body
        let jalan = `${address} ${subdistrict} ${city} ${province}`

        let response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${jalan}&key=f3582c716b9f443a9d260569d39b1ac3`)

        console.log(response)
        await db.location_warehouse.update({
            province, city, subdistrict, address, latitude: response.data.results[0].geometry.lat, longitude: response.data.results[0].geometry.lng, city_id, province_id
        },
            {
                where: {
                    id
                }
            }
        )
        res.status(201).send({
            isError: false,
            message: 'Update WH success!'
        })
    },
    deleteWH: async (req, res) => {
        let { id } = req.body

        await db.location_warehouse.destroy({
            where: {
                id
            }
        })
        res.status(201).send({
            isError: false,
            message: 'Delete WH Success!'
        })
    }


}