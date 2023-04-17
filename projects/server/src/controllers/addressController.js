//import sequelize 
const { sequelize } = require('./../models')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');

const db = require('./../models/index')
const axios = require('axios')

module.exports = {
    getAllAddress: async (req, res) => {
        try {
            let getData = req.dataToken
            // console.log(getData);
            let data = await db.user_address.findAll({
                where: {
                    user_id: getData.id
                },
                include: {
                    model: db.user
                }
            })
            // console.log(data);
            res.status(200).send({
                isError: false,
                message: "Get All Address Success",
                data,
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    postAddress: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let { receiver_name, user_address, value, province, city, city_id, subdistrict, phone_number } = req.body
            let getData = req.dataToken

            let jalan = `${user_address}%20${subdistrict}%20${city}%20${province}`
            // console.log(jalan)

            let response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${jalan}&key=f3582c716b9f443a9d260569d39b1ac3`)
            // console.log(response.data.results[0].geometry.lat)

            let data = await db.user_address.create({ receiver_name, value, user_address, province, city, city_id, subdistrict, phone_number, user_id: getData.id, latitude: response.data.results[0].geometry.lat, longitude: response.data.results[0].geometry.lng }, { transaction: t })

            await t.commit()
            res.status(200).send({
                isError: false,
                message: "Post Address Success",
                data,
            })
        } catch (error) {
            await t.rollback()
            res.status(400).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
}