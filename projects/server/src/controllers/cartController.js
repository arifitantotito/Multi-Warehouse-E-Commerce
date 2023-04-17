//import sequelize 
const { sequelize } = require('./../models')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');

const db = require('./../models/index')

module.exports = {
    addCart: async (req, res) => {
        try {
            let getToken = req.dataToken
            // console.log(getToken.id)

            let { qty, product_id, product_detail_id } = req.body
            // console.log(qty)
            // console.log(product_id)
            // console.log(user_id)
            // console.log(product_detail_id)

            let checkQty = await db.product_detail.findOne({
                where: {
                    id: product_detail_id
                }
            })

            if (checkQty.qty === 0) return res.status(404).send({
                isError: true,
                message: 'Product out of stock',
                data: null
            })

            if (qty > checkQty.qty) return res.status(400).send({
                isError: true,
                message: 'Limited Stock Product',
                data: null
            })


            let checkData = await db.cart.findOne({
                where: {
                    product_detail_id
                }
            })
            // console.log(checkData)

            if (!checkData) {
                await db.cart.create({
                    qty, product_id, user_id: getToken.id, product_detail_id
                })
            } else if (checkData) {
                await db.cart.update({
                    qty: checkData.qty + qty
                }, {
                    where: {
                        product_detail_id
                    }
                })
            }

            res.status(201).send({
                isError: false,
                message: "Add Product To Cart Success!",
                data: checkData
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    getDataCart: async (req, res) => {
        try {
            let getToken = req.dataToken

            let dataCart = await db.cart.findAll({
                where: {
                    user_id: getToken.id
                },
                include: [{ model: db.product_detail }, { model: db.product, include: { model: db.product_image } }]
            })

            res.status(201).send({
                isError: false,
                message: 'Get Data Cart Success!',
                data: dataCart
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    deleteCart: async (req, res) => {
        try {
            let { id } = req.body

            await db.cart.destroy({
                where: {
                    id
                }
            })

            res.status(201).send({
                isError: false,
                message: 'Delete Cart Success',
                data: null
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    updateQty: async (req, res) => {
        try {
            let { id, qtyx, type } = req.body

            // let getData=await db.cart.findOne({
            //     where: {
            //         id
            //     }
            // })
            // console.log(id)
            // console.log(parseInt(qtyx) + 1)
            // console.log(type)

            let checkQty = await db.cart.findOne({
                where: {
                    id
                },
                include: { model: db.product_detail }
            })
            // console.log(checkQty)


            if (type === "+") {
                if (parseInt(qtyx) + 1 > checkQty.dataValues.product_detail.dataValues.qty) throw { message: 'Item has limited stock' }
                let getData = await db.cart.update({
                    qty: parseInt(qtyx) + 1
                }, {
                    where: {
                        id
                    }
                })
            } else {
                if (parseInt(qtyx) - 1 === 0) {
                    await db.cart.destroy({
                        where: {
                            id
                        }
                    })
                } else {
                    await db.cart.update({
                        qty: parseInt(qtyx) - 1
                    }, {
                        where: {
                            id
                        }
                    })
                }
            }



            res.status(201).send({
                isError: false,
                message: 'Update Cart Success',
                data: null
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}