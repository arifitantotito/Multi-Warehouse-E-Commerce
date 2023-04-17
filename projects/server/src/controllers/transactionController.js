//import sequelize
const { sequelize } = require('../models')
const { Op } = require('sequelize')

const db = require('../models/index')
const moment = require('moment')
const fs = require('fs')
const deleteFiles = require('./../helpers/deleteFiles')

module.exports = {
    allTransaction: async (req, res) => {
        try {
            let { warehouse, order_status_id, from, to, page } = req.body
            console.log(to)
            console.log(from)
            console.log(`ini warehouse ${warehouse}`)
            var page_size = 3;
            var offset = (page - 1) * page_size;
            var limit = page_size;
            
            if (!from && !to) {
                if (order_status_id == 0) {
                    console.log('masuk 1')
                    var total_count = warehouse !=0 ? await db.transaction.count({ where: { location_warehouse_id: warehouse } }) : await db.transaction.count()
                    var total_pages = Math.ceil(total_count / page_size)
                    var response = warehouse !=0 ? await db.transaction.findAll({
                        where: { location_warehouse_id: warehouse },
                        include: [
                            { model: db.location_warehouse },
                            { model: db.transaction_detail },
                            { model: db.order_status }
                        ],
                        order:[['createdAt', 'DESC']],
                        offset,
                        limit
                    })
                        :
                        await db.transaction.findAll({
                            include: [
                                { model: db.location_warehouse },
                                { model: db.transaction_detail },
                                { model: db.order_status }
                            ],
                            order:[['createdAt', 'DESC']],
                            offset,
                            limit
                        })
                } else {
                    console.log('masuk 2')
                    var total_count = warehouse !=0 ? await db.transaction.count({ where: { location_warehouse_id: warehouse, order_status_id } }) : await db.transaction.count({ where: { order_status_id } })
                    var total_pages = Math.ceil(total_count / page_size)
                    var response = warehouse !=0 ? await db.transaction.findAll({
                        where: { location_warehouse_id: warehouse, order_status_id },
                        include: [
                            { model: db.location_warehouse },
                            { model: db.transaction_detail },
                            { model: db.order_status }
                        ],
                        order:[['createdAt', 'DESC']],
                        offset,
                        limit
                    })
                        :
                        await db.transaction.findAll({
                            where: { order_status_id },
                            include: [
                                { model: db.location_warehouse },
                                { model: db.transaction_detail },
                                { model: db.order_status }
                            ],
                            order:[['createdAt', 'DESC']],
                            offset,
                            limit
                        })
                }
            } else if (!to){
                console.log('masuk 3')
                if (order_status_id == 0) {
                    var total_count = warehouse !=0 ? await db.transaction.count({ where: { location_warehouse_id: warehouse, updatedAt: {
                        [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                        [Op.lte]: moment(from).add(2, 'days').format().split("T")[0]
                    }} })
                        : await db.transaction.count({ where: { updatedAt:{
                            [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                            [Op.lte]: moment(from).add(2, 'days').format().split("T")[0]
                        }} })
                    var total_pages = Math.ceil(total_count / page_size)
                    var response = warehouse !=0 ? await db.transaction.findAll({
                        where: {
                            location_warehouse_id: warehouse, updatedAt: {
                                [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                [Op.lte]: moment(from).add(2, 'days').format().split("T")[0]
                            }
                        },
                        include: [
                            { model: db.location_warehouse },
                            { model: db.transaction_detail },
                            { model: db.order_status }
                        ],
                        order:[['createdAt', 'DESC']],
                        offset,
                        limit
                    })
                        :
                        await db.transaction.findAll({
                            where: {
                                updatedAt: {
                                    [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                [Op.lte]: moment(from).add(2, 'days').format().split("T")[0]
                                }
                            },
                            include: [
                                { model: db.location_warehouse },
                                { model: db.transaction_detail },
                                { model: db.order_status }
                            ],
                            order:[['createdAt', 'DESC']],
                            offset,
                            limit
                        })
                } else {
                    console.log('masuk 4')
                    console.log(order_status_id)
                    var total_count = warehouse !=0 ? await db.transaction.count({ where: { location_warehouse_id: warehouse, order_status_id, updatedAt:{[Op.lt] :moment(from).add(2, 'days').format().split("T")[0],[Op.gte]:moment(from).add(1, 'days').format().split("T")[0] }} })
                        : await db.transaction.count({ where: { updatedAt:{[Op.lt] :moment(from).add(2, 'days').format().split("T")[0],[Op.gte]:moment(from).add(1, 'days').format().split("T")[0] }} })
                    var total_pages = Math.ceil(total_count / page_size)
                    var response = warehouse !=0 ? await db.transaction.findAll({
                        where: { location_warehouse_id: warehouse, order_status_id, updatedAt:{[Op.lt] :moment(from).add(2, 'days').format().split("T")[0],[Op.gte]:moment(from).add(1, 'days').format().split("T")[0] }},
                        include: [
                            { model: db.location_warehouse },
                            { model: db.transaction_detail },
                            { model: db.order_status }
                        ],
                        order:[['createdAt', 'DESC']],
                        offset,
                        limit
                    })
                        :
                        await db.transaction.findAll({
                            where: { order_status_id, updatedAt:{[Op.lt] :moment(from).add(2, 'days').format().split("T")[0],[Op.gte]:moment(from).add(1, 'days').format().split("T")[0] }},
                            include: [
                                { model: db.location_warehouse },
                                { model: db.transaction_detail },
                                { model: db.order_status }
                            ],
                            order:[['createdAt', 'DESC']],
                            offset,
                            limit
                        })
                }
            } else {
                console.log('masuk 5')
                if (order_status_id == 0) {
                    var total_count = warehouse !=0 ? await db.transaction.count({
                        where: {
                            location_warehouse_id: warehouse,
                            updatedAt: {
                                [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                            }
                        }
                    })
                        : await db.transaction.count({
                            where: {
                                updatedAt: {
                                    [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                    [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                                }
                            }
                        })
                    var total_pages = Math.ceil(total_count / page_size)
                    var response = warehouse !=0 ? await db.transaction.findAll({
                        where: {
                            location_warehouse_id: warehouse,
                            updatedAt: {
                                [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                            }
                        },
                        include: [
                            { model: db.location_warehouse },
                            { model: db.transaction_detail },
                            { model: db.order_status }
                        ],
                        order:[['createdAt', 'DESC']],
                        offset,
                        limit
                    })
                        :
                        await db.transaction.findAll({
                            where: {
                                updatedAt: {
                                    [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                    [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                                }
                            },
                            include: [
                                { model: db.location_warehouse },
                                { model: db.transaction_detail },
                                { model: db.order_status }
                            ],
                            order:[['createdAt', 'DESC']],
                            offset,
                            limit
                        })
                } else {
                    console.log('masuk 6')
                    var total_count = warehouse !=0 ? await db.transaction.count({
                        where: {
                            location_warehouse_id: warehouse, order_status_id,
                            updatedAt: {
                                [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                            }
                        }
                    })
                        : await db.transaction.count({
                            where: {
                                order_status_id, updatedAt: {
                                    [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                    [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                                }
                            }
                        })
                    var total_pages = Math.ceil(total_count / page_size)
                    var response = warehouse !=0 ? await db.transaction.findAll({
                        where: {
                            location_warehouse_id: warehouse, order_status_id,
                            updatedAt: {
                                [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                            }
                        },
                        include: [
                            { model: db.location_warehouse },
                            { model: db.transaction_detail },
                            { model: db.order_status }
                        ],
                        order:[['createdAt', 'DESC']],
                        offset,
                        limit
                    })
                        :
                        await db.transaction.findAll({
                            where: {
                                order_status_id, updatedAt: {
                                    [Op.gte]: moment(from).add(1, 'days').format().split("T")[0],
                                    [Op.lt]: moment(to).add(2, 'days').format().split("T")[0]
                                }
                            },
                            include: [
                                { model: db.location_warehouse },
                                { model: db.transaction_detail },
                                { model: db.order_status }
                            ],
                            order:[['createdAt', 'DESC']],
                            offset,
                            limit
                        })
                }
            }

            if (!response) throw { message: 'data not found!' }
            res.status(201).send({
                isError: false,
                message: 'get data transaction success!',
                data: {
                    response,
                    total_count,
                    total_pages
                }
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    transactionWH: async (req, res) => {
        //     let {city} = req.body

        //    let response = await db.transaction.findAll({
        //     where:{
        //         warehouse_city:city
        //     }
        //    })

        //or you can use this?
        let { id } = req.body
        let response = await db.transaction.findAll({
            where: {
                location_warehouse_id: id
            }
        })
        res.status(201).send({
            isError: false,
            message: 'get data transaction success!',
            data: response
        })
    },
    filterWH: async (req, res) => {
        try {

            let { warehouse_city, order_status_id } = req.body

            let getData = order_status_id ? await db.transaction.findAll({
                where: {
                    warehouse_city, order_status_id
                },
                include: [
                    { model: db.location_warehouse },
                    { model: db.transaction_detail },
                    { model: db.order_status },
                ]
            }) : await db.transaction.findAll({
                where: {
                    warehouse_city
                },
                include: [
                    { model: db.location_warehouse },
                    { model: db.transaction_detail },
                    { model: db.order_status },
                ]
            })

            if (!getData) throw { message: 'Data Not Found!' }

            res.status(201).send({
                isError: false,
                message: 'get data success!',
                data: getData
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    filter: async (req, res) => {
        try {
            let { data } = req.body

            let getData = data == "Warehouse" ? await db.location_warehouse.findAll() : null
            console.log(getData)

            res.status(201).send({
                isError: false,
                message: 'get data success!',
                data: getData
            })
        } catch (error) {
            console.log(error)
        }
    },
    getSales: async (req, res) => {
        let { start, end, type, WH, page } = req.query
        console.log(`ini warehouse ${WH}`)

        var getMoney = await db.transaction_detail.findAll({
            include:{
                model:db.transaction, where:{
                   order_status_id:{[Op.eq] : 5
}            }}
            })
        var totalMoney = 0

        for await (const item of getMoney) {
            totalMoney += item.dataValues.qty*item.dataValues.price
        }
        
        if (type == 1) {
            var response = WH == 0 ? await db.transaction.findAll({
                where: {
                    [Op.and]: [
                        {
                            updatedAt: {
                                [Op.gte]: start,
                                [Op.lt]: end
                            }
                        },
                        {
                            order_status_id: 5
                        }

                    ]

                },
                include: [
                    { model: db.location_warehouse },
                    { model: db.transaction_detail },
                    { model: db.order_status }
                ]
            }) : await db.transaction.findAll({
                where: {
                    [Op.and]: [
                        {
                            updatedAt: {
                                [Op.gte]: start,
                                [Op.lt]: end
                            }
                        },
                        {
                            order_status_id: 5
                        },
                        {
                            location_warehouse_id: WH
                        }
                    ]
                },
                include: [
                    { model: db.location_warehouse },
                    { model: db.transaction_detail },
                    { model: db.order_status }
                ]
            })
            var cancel_t = WH == 0 ?  await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 6
                    }
                ]}
            })
            :
            await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 6
                    },
                    {
                        location_warehouse_id: WH
                    }]}
            })
            var success_t = WH==0? await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 5
                    }]}
            })
            :
            await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 5
                    },{
                        location_warehouse_id: WH
                    }
                ]}
            })
            var list_WH = WH == 0 ? await db.location_warehouse.findAll() : await db.location_warehouse.findOne({ where: { id: WH } })
            
        } else if (type == 2) {
            var cancel_t = WH == 0 ?  await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 6
                    }
                ]}
            })
            :
            await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 6
                    },
                    {
                        location_warehouse_id: WH
                    }]}
            })
            var success_t = WH==0? await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 5
                    }]}
            })
            :
            await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 5
                    },{
                        location_warehouse_id: WH
                    }
                ]}
            })
            var response = WH == 0 ? await db.category.findAll({
                include: [
                    {
                        model: db.transaction_detail,
                        include: [
                            {
                                model: db.transaction,
                                where: {
                                    [Op.and]: [
                                        {
                                            updatedAt: {
                                                [Op.gte]: start,
                                                [Op.lt]: end
                                            }
                                        },
                                        {
                                            order_status_id: 5
                                        }
                                    ]

                                }
                            }
                        ]
                    }
                ]
            }) :
                await db.category.findAll({
                    include: [
                        {
                            model: db.transaction_detail,
                            include: [
                                {
                                    model: db.transaction,
                                    where: {
                                        [Op.and]: [
                                            {
                                                updatedAt: {
                                                    [Op.gte]: start,
                                                    [Op.lt]: end
                                                }
                                            },
                                            {
                                                order_status_id: 5
                                            },
                                            {
                                                location_warehouse_id: WH
                                            }
                                        ]

                                    }
                                }
                            ]
                        }
                    ]
                })
        } else if (type == 3) {
            var cancel_t = WH == 0 ?  await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 6
                    }
                ]}
            })
            :
            await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 6
                    },
                    {
                        location_warehouse_id: WH
                    }]}
            })
            var success_t = WH==0? await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 5
                    }]}
            })
            :
            await db.transaction.count({
                where:{ [Op.and]: [
                    {
                        updatedAt: {
                            [Op.gte]: start,
                            [Op.lt]: end
                        }
                    },
                    {
                        order_status_id: 5
                    },{
                        location_warehouse_id: WH
                    }
                ]}
            })
            var page_size = 5;
            var offset = (page - 1) * page_size
            var limit = page_size;

            var total_count = WH == 0 ? await db.transaction_detail.count({
                include: [{
                    model: db.transaction,
                    where: {
                        [Op.and]: [
                            {
                                updatedAt: {
                                    [Op.gte]: start,
                                    [Op.lt]: end
                                }
                            },
                            {
                                order_status_id: 5
                            }
                        ]
                    }
                }]
            })
            :
            await db.transaction_detail.count({
                include: [{
                    model: db.transaction,
                    where: {
                        [Op.and]: [
                            {
                                updatedAt: {
                                    [Op.gte]: start,
                                    [Op.lt]: end
                                }
                            },
                            {
                                order_status_id: 5
                            },
                            {
                                location_warehouse_id: WH
                            }
                        ]
                    }
                }]
            })

            var total_pages = Math.ceil(total_count / page_size)
            var response = WH == 0 ? await db.transaction_detail.findAll({
                include: [{
                    model: db.transaction,
                    where: {
                        [Op.and]: [
                            {
                                updatedAt: {
                                    [Op.gte]: start,
                                    [Op.lt]: end
                                }
                            },
                            {
                                order_status_id: 5
                            }
                        ]
                    }
                },{model:db.product_detail}], offset,limit
            })
                :
                await db.transaction_detail.findAll({
                    include: [{
                        model: db.transaction,
                        where: {
                            [Op.and]: [
                                {
                                    updatedAt: {
                                        [Op.gte]: start,
                                        [Op.lt]: end
                                    }
                                },
                                {
                                    order_status_id: 5
                                },
                                {
                                    location_warehouse_id: WH
                                }
                            ]
                        }
                    },{model:db.product_detail}],offset,limit
                })
        }
        res.status(201).send({
            isError: false,
            data: response,
            cancel_t,
            list_wh: list_WH,
            success_t,
            page,
            total_count,
            total_pages, totalMoney
        })

    },
    CreateOrder: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            // let getToken = req.dataToken
            // console.log(getToken)
            let { user_id, ongkir, receiver, address, courier, user_name, phone_number, subdistrict, province, city, upload_payment, cart, user_address_id } = req.body
            // console.log(cart)

            let findData = await db.user_address.findOne({
                where: {
                    id: user_address_id
                }
            }, { transaction: t })
            // console.log(findData)

            let dataWH = await db.location_warehouse.findAll()
            // console.log(dataWH)



            let distanceWH = []
            for (let i = 0; i < dataWH.length; i++) {
                let latlongWH = []

                const R = 6371e3; // metres
                const φ1 = parseFloat(findData.dataValues.latitude) * Math.PI / 180; // φ, λ in radians
                const φ2 = parseFloat(dataWH[i].dataValues.latitude) * Math.PI / 180;
                const Δφ = (parseFloat(dataWH[i].dataValues.latitude) - (parseFloat(findData.dataValues.latitude))) * Math.PI / 180;
                const Δλ = (parseFloat(dataWH[i].dataValues.longitude) - parseFloat(findData.dataValues.longitude)) * Math.PI / 180;

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const d = R * c;

                latlongWH.push(dataWH[i].dataValues.city)
                latlongWH.push(d / 1000)
                distanceWH.push(latlongWH)
            }
            console.log(distanceWH)

            let closestWH = distanceWH[0][1]
            let cityWH

            for (let i = 0; i < distanceWH.length; i++) {
                if (distanceWH[i][1] < closestWH) {
                    closestWH = distanceWH[i][1]
                    cityWH = distanceWH[i][0]
                }
            }
            // console.log(cityWH,closestWH)

            let findWH = await db.location_warehouse.findOne({
                where: {
                    city: cityWH
                }
            }, { transaction: t })
            // console.log(findWH)

            // console.log(Math.min(...closestWH))
            const x = new Date().toJSON()
            // console.log(x)
            const date = new Date().toJSON().slice(0, 10).split('-');
            // console.log(date)
            // console.log(`${date[0]}${date[1]}${date[2]}`);

            let idTransaction = `INV/${date[0]}${date[1]}${date[2]}/MPL/${Math.floor(Math.random()*1000) + Date.now().toString().slice(10)}`

            var kreat = await db.transaction.create({
                id: `${idTransaction}`, user_id, ongkir, receiver, address, warehouse_city: findWH.dataValues.city, location_warehouse_id: findWH.dataValues.id,
                courier, user_name, phone_number, subdistrict, city, province, upload_payment, order_status_id: 1,
                exprired: moment().add(2, 'hour').toDate()
            }, { transaction: t })

            var words = ''

            cart.forEach((item, index) => {
                words += `UPDATE product_details, transactions SET product_details.qty = product_details.qty +${item.qty} WHERE product_details.id = ${item.product_detail_id} AND transactions.id = "${kreat.dataValues.id}" AND upload_payment IS NULL ;`
            })
            console.log(words)

            await sequelize.query(`
            CREATE EVENT transaction_expired_${kreat.dataValues.id.split('/')[3]} ON SCHEDULE AT NOW() + INTERVAL 2 HOUR
            DO BEGIN
            UPDATE transactions SET order_status_id = 6 WHERE id = "${kreat.dataValues.id}" AND upload_payment IS NULL;
            INSERT INTO status_transaction_logs (order_status_id,transaction_id)
            SELECT 6, "${kreat.dataValues.id}" FROM DUAL
            WHERE EXISTS(SELECT 1 FROM transactions WHERE id="${kreat.dataValues.id}" AND upload_payment IS NULL);
            ${words}
            
            END;`)


            await db.status_transaction_log.create({
                transaction_id: kreat.dataValues.id, order_status_id: 1
            }, { transaction: t })

            let dataCart = []
            for (let i = 0; i < cart.length; i++) {
                dataCart.push({
                    transaction_id: kreat.dataValues.id,
                    qty: cart[i].qty,
                    price: cart[i].product_detail.price,
                    product_name: cart[i].product.name,
                    weight: cart[i].product_detail.weight,
                    memory_storage: cart[i].product_detail.memory_storage,
                    color: cart[i].product_detail.color,
                    connectivity: cart[i].product_detail.connectivity,
                    screen_size: cart[i].product_detail.screen_size,
                    processor: cart[i].product_detail.processor,
                    product_img: cart[i].product.product_images[0].img,
                    category_id: cart[i].product.category_id,
                    product_detail_id: cart[i].product_detail.id,
                    product_id : cart[i].product_id
                })
            }
            // console.log(dataCart)

            await db.transaction_detail.bulkCreate(dataCart, { transaction: t })

            await db.cart.destroy({
                where: {
                    user_id
                }
            })

            cart.forEach(async (item, index) => {
                let compare = await db.product_detail.findOne({
                    where: {
                        id: item.product_detail_id
                    }
                })
                await db.product_detail.update({ qty: compare.dataValues.qty - item.qty }, {
                    where: {
                        id: item.product_detail_id
                    }
                })
            }, { transaction: t })

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'data success',
                data: kreat
            })
        } catch (error) {
            console.log(error)
            await t.rollback()
            res.status(401).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    updateOrder: async (req, res) => {
        let { transaction_id, code, load, warehouse_id } = req.query

        //getting the transaction data
        var transaction_detail = JSON.parse(load)
        if (code == 3) {
            //dibawah ini apabila kondisi qty barang di warehouse yg bersangkutan tidak memenuhi jumlahnya
            transaction_detail.forEach(async (item, index) => {
                var findData = await db.location_warehouse.findOne({
                    where: {
                        id: warehouse_id
                    },
                    include: {
                        model: db.location_product, where: {
                            product_detail_id: item.product_detail_id
                        }
                    }
                })
                // console.log(findData.dataValues.location_products[0].dataValues.qty)
                if (item.qty > findData.dataValues.location_products[0].dataValues.qty) {
                    let dataWH = await db.location_warehouse.findAll({
                        where: {
                            id: { [Op.ne]: warehouse_id }
                        },
                        include: {
                            model: db.location_product,
                            where: {
                                product_detail_id: item.product_detail_id,
                                qty: { [Op.gt]: 0 }
                            }
                        }
                    })
                    // console.log(dataWH[0].dataValues.location_products[0].dataValues)
                    var distanceWH = []
                    for (let i = 0; i < dataWH.length; i++) {
                        let latlongWH = []

                        const R = 6371e3; // metres
                        const φ1 = parseFloat(findData.dataValues.latitude) * Math.PI / 180; // φ, λ in radians
                        const φ2 = parseFloat(dataWH[i].dataValues.latitude) * Math.PI / 180;
                        const Δφ = (parseFloat(dataWH[i].dataValues.latitude) - (parseFloat(findData.dataValues.latitude))) * Math.PI / 180;
                        const Δλ = (parseFloat(dataWH[i].dataValues.longitude) - parseFloat(findData.dataValues.longitude)) * Math.PI / 180;

                        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                            Math.cos(φ1) * Math.cos(φ2) *
                            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                        const d = R * c;
                        latlongWH.push(d / 1000)
                        latlongWH.push(dataWH[i].dataValues.id)

                        latlongWH.push(dataWH[i].dataValues.location_products[0].dataValues.qty)
                        latlongWH.push(dataWH[i].dataValues.location_products[0].dataValues.id)

                        distanceWH.push(latlongWH)
                    }

                    distanceWH.sort((a, b) => a[0] - b[0])
                    console.log(distanceWH)

                    //get qty item in origin warehouse
                    let dataCompare = await db.location_product.findOne({
                        where: {
                            location_warehouse_id: warehouse_id,
                            product_detail_id: item.product_detail_id
                        }
                    })

                    let initialQty = dataCompare.dataValues.qty
                    for (let i = 0; i < distanceWH.length; i++) {
                        let x = item.qty - initialQty
                        if (distanceWH[i][2] - x > 0) {
                            await db.location_product.update({
                                qty: distanceWH[i][2] - x
                            },
                                {
                                    where: {
                                        location_warehouse_id: distanceWH[i][1],
                                        product_detail_id: item.product_detail_id
                                    }
                                })

                            await db.log_request.create({
                                location_warehouse_id_origin:distanceWH[i][1],
                                location_warehouse_id_target:warehouse_id,
                                location_product_id_origin: distanceWH[i][3],
                                location_product_id_target: findData.dataValues.location_products[0].dataValues.id,
                                product_detail_id: item.product_detail_id,
                                qty: x,
                                order_status_id: 8
                            })

                            await db.log_stock.bulkCreate([
                                {
                                    qty: x,
                                    location_warehouse_id: distanceWH[i][1],
                                    status: 'Reduction',
                                    product_detail_id: item.product_detail_id,
                                    product_id:item.product_id
                                },
                                {
                                    qty: x,
                                    location_warehouse_id: warehouse_id,
                                    status: 'Additional',
                                    product_detail_id: item.product_detail_id,
                                    product_id:item.product_id
                                }
                            ])

                            await db.log_stock.create({
                                qty: item.qty,
                                location_warehouse_id: warehouse_id,
                                status: 'Sold',
                                product_detail_id: item.product_detail_id,
                                product_id:item.product_id
                            })

                            await db.location_product.update({
                                qty: 0
                            },
                                {
                                    where: {
                                        location_warehouse_id: warehouse_id,
                                        product_detail_id: item.product_detail_id
                                    }
                                })

                            break
                        } else {
                            await db.location_product.update({
                                qty: 0
                            },
                                {
                                    where: {
                                        location_warehouse_id: distanceWH[i][1],
                                        product_detail_id: item.product_detail_id
                                    }
                                })

                            await db.log_request.create({

                                location_warehouse_id_origin:distanceWH[i][1],
                                location_warehouse_id_target:warehouse_id,
                                location_product_id_origin: distanceWH[i][3],
                                location_product_id_target: findData.dataValues.location_products[0].dataValues.id,
                                product_detail_id: item.product_detail_id,
                                qty: distanceWH[i][2],
                                order_status_id: 8
                            })

                            await db.log_stock.bulkCreate([
                                {
                                    qty: distanceWH[i][2],
                                    location_warehouse_id: distanceWH[i][1],
                                    status: 'Reduction',
                                    product_detail_id: item.product_detail_id,
                                    product_id:item.product_id
                                },
                                {
                                    qty: distanceWH[i][2],
                                    location_warehouse_id: warehouse_id,
                                    status: 'Additional',
                                    product_detail_id: item.product_detail_id,
                                    product_id:item.product_id
                                }
                            ])

                            initialQty += distanceWH[i][2]
                        }
                    }
                }
                else {
                    await db.location_product.update({
                        qty: findData.dataValues.location_products[0].dataValues.qty - item.qty
                    },
                        {
                            where: {
                                location_warehouse_id: warehouse_id,
                                product_detail_id: item.product_detail_id
                            }
                        })

                    await db.log_stock.create({
                        qty: item.qty,
                        location_warehouse_id: warehouse_id,
                        status: 'Sold',
                        product_detail_id: item.product_detail_id,
                        product_id:item.product_id
                    })
                }
            })

            await db.status_transaction_log.create({
                transaction_id, order_status_id: code
            })

            await db.transaction.update({ order_status_id: code }, {
                where: {
                    id: transaction_id
                }
            })

        } else if (code == 1) {

            let compareData = await db.transaction.findOne({
                where: {
                    id: transaction_id
                }
            })

            if (Date.now() <= compareData.dataValues.exprired) {
                
                db.transaction.update({ order_status_id: code, upload_payment: null }, {
                    where: {
                        id: transaction_id
                    }
                })

                db.status_transaction_log.create({
                    transaction_id, order_status_id: code
                })
            } else {
                transaction_detail.forEach(async (item, index) => {
                    let getData = await db.product_detail.findOne({
                        where: {
                            id: item.product_detail_id
                        }
                    })

                    await db.product_detail.update({
                        qty: getData.dataValues.qty + item.qty
                    }, {
                        where: {
                            id: item.product_detail_id
                        }
                    })
                    // ini kalo mau balikin log request nya tapi gak bisa karena gk dpt history nya
                    // await db.log_stock.bulkCreate([
                    //     {
                    //         qty:item.qty,
                    //         location_warehouse_id:warehouse_id,
                    //         status:'Reduction',
                    //         product_detail_id:item.product_detail_id
                    //     },
                    //     {
                    //         qty:item.qty,
                    //         location_warehouse_id:warehouse_id,
                    //         status:'Additional',
                    //         product_detail_id:item.product_detail_id
                    //     }
                    // ])

                })

                db.transaction.update({ order_status_id: 6 }, {
                    where: {
                        id: transaction_id
                    }
                })

                db.status_transaction_log.create({
                    transaction_id, order_status_id: 6
                })
            }
        }

        res.status(201).send({
            isError: false,
            message: code == 3 ? 'Order confirmed' : 'Order canceled'
        })
    },
    getDataTransaction: async (req, res) => {
        try {
            let getToken = req.dataToken
            // console.log(getToken)
            let { id } = req.query
            // console.log(id)
            let data = await db.transaction.findOne({
                where: {
                    user_id: getToken.id,
                    id
                },
                include: [
                    { model: db.order_status },
                    { model: db.transaction_detail }
                ]
            })

            // console.log(data)
            res.status(201).send({
                isError: false,
                message: 'data success',
                data: data
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    allTransactionUser: async (req, res) => {
        try {
            let getToken = req.dataToken
            // console.log(getToken)

            let data = await db.transaction.findAll({
                where: {
                    user_id: getToken.id
                },
                include: [
                    { model: db.order_status },
                    { model: db.transaction_detail }
                ]
            })

            // console.log(data)
            res.status(201).send({
                isError: false,
                message: 'data success',
                data
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    detailTransactionUser: async (req, res) => {
        try {
            let { id } = req.query
            console.log(id)


            let data = await db.transaction.findOne({
                where: {
                    id
                },
                include: [
                    { model: db.order_status },
                    { model: db.transaction_detail }
                ]
            })

            // console.log(data)
            res.status(201).send({
                isError: false,
                message: 'Get Detail Transaction Success',
                data: data
            })

        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    uploadPayment: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let { id } = req.body
            console.log(req.files)
            let paymentProof = await db.transaction.update({ upload_payment: `Public/images/${req.files.images[0].filename}`, order_status_id: 2 }, {
                where: {
                    id: id
                }
            }, { transaction: t })

            await db.status_transaction_log.create({
                transaction_id:id,order_status_id:2
            })

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Upload Payment Proof Success!',
                data: paymentProof
            })

        } catch (error) {
            await t.rollback()
            deleteFiles(req.files)
            console.log(error)
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    cancelTransactions: async (req, res) => {
        try {
            let { id } = req.body
            // console.log(id)

            await db.transaction.update({
                order_status_id: 6
            }, {
                where: {
                    id
                }
            })

            res.status(201).send({
                isError: false,
                message: 'Cancel Transaction Success!',
                data: null
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    shipOrder: async (req, res) => {
        let { transaction_id, code, load, warehouse_id } = req.query

        var transaction_detail = JSON.parse(load)

        if (code == 4) {
            await db.transaction.update({ order_status_id: 4, exprired: moment().add(7, 'day').toDate() }, {
                where: {
                    id: transaction_id
                }
            })

            await db.status_transaction_log.create({
                transaction_id, order_status_id: code
            })

            await sequelize.query(`
            CREATE EVENT shipping_expired_${transaction_id.split('/')[3]} ON SCHEDULE AT NOW() + INTERVAL 7 DAY
            DO BEGIN
             UPDATE transactions SET order_status_id = 5 WHERE id = "${transaction_id}";
             INSERT INTO status_transaction_logs (order_status_id,transaction_id) VALUES (5, "${transaction_id}");
             END;`)

        } else if (code == 6) {
            console.log(transaction_detail)
            transaction_detail.forEach(async (item, index) => {
                let getQty = await db.product_detail.findOne({
                    where: {
                        id: item.product_detail_id
                    },
                    include: {
                        model: db.location_product, where: {
                            location_warehouse_id: warehouse_id
                        }
                    }
                })
                // console.log(getQty)


                await db.product_detail.update({ qty: getQty.dataValues.qty + item.qty }, {
                    where: {
                        id: item.product_detail_id
                    }
                })
                await db.location_product.update({ qty: getQty.dataValues.location_products[0].dataValues.qty + item.qty }, {
                    where: {
                        location_warehouse_id: warehouse_id,
                        product_detail_id: item.product_detail_id
                    }
                })

                await db.log_stock.create({
                    qty: item.qty,
                    location_warehouse_id: warehouse_id,
                    status: 'Cancelation',
                    product_detail_id: item.product_detail_id,
                    product_id:item.product_id
                }
                )
            })
            await db.transaction.update({ order_status_id: 6 }, {
                where: {
                    id: transaction_id
                }
            })
            await db.status_transaction_log.create({
                transaction_id, order_status_id: code
            })
        }

        res.status(201).send({
            isError: false,
            message: code == 6 ? 'Order canceled' : 'Sending item'
        })
    },
    test: async (req, res) => {
        let { date, id } = req.body
        
// let response = await db.log_stock.findAll({
//     where:{status:{[Op.in]:['Cancelation', 'Sold']}}
// })

let response = await db.admin.findAll({
    where:{
      email:{  [Op.startsWith]:''}
    }
})
        res.status(201).send({
        response,
           message:'foto deleted'
        })
    },

    confirmOrder: async (req, res) => {
        try {
            let { id } = req.body
            // console.log(id)

            await db.transaction.update({
                order_status_id: 5
            }, {
                where: {
                    id
                }
            })

            await db.status_transaction_log.create({
                transaction_id:id,order_status_id:5
            })

            res.status(201).send({
                isError: false,
                message: 'Confirm Order Success!',
                data: null
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    getAllTransactionUser: async (req, res) => {
        try {
            let getToken = req.dataToken
            // console.log(getToken)

            let { page } = req.query

            let data1 = await db.transaction.findAll({
                where: {
                    user_id: getToken.id
                }
            })

            var limit = 5
            var pages = Math.ceil(data1.length / limit)
            var offset = limit * (Number(page) - 1)

            let data = await db.transaction.findAll({
                where: {
                    user_id: getToken.id
                },
                include: [
                    { model: db.order_status },
                    { model: db.transaction_detail }
                ],
                offset,
                limit
            })

            // console.log(data)
            return res.status(200).send({
                isError: false,
                message: "Get All Transaction Success",
                data: data,
                total: data1.length,
                page: Number(page),
                pages: pages
            });
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error,
                data: null
            })
        }
    }
}
