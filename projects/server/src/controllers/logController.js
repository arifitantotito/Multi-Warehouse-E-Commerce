//import sequelize
const { sequelize } = require('../models')
const { Op } = require('sequelize')


const db = require('../models/index')
const moment = require('moment')


module.exports = {
    getAllLog: async (req, res) => {
        const { page, warehouse_id, code, date, pilihKategori, pilihProduk, filterStatus } = req.query;
        var tanggal = date == 0 ? moment(new Date()).format('MM/01/YYYY') : moment(date).format('MM/01/YYYY')
        let stetus = filterStatus==''?['Additional','Reduction','Cancelation','Sold'] : [`${filterStatus}`]
        if (code == 1) {
            var page_size = 3;
            var offset = (page - 1) * page_size
            var limit = page_size;

            var category = await db.category.findAll()
            var product = await db.product.findAll({
                where: { category_id: pilihKategori }
            })

            var addition = [], reduction = [], f_addition = [], f_reduction = []

            var total_count = pilihProduk == 0 ?
                await db.product_detail.count({
                    where: { product_id: product[0].dataValues.id }, offset, limit
                }) :
                await db.product_detail.count({
                    where: { product_id: pilihProduk }, offset, limit
                })
            var total_pages = Math.ceil(total_count / page_size)

            var getData = pilihProduk == 0 ?
                await db.product_detail.findAll({
                    where: { product_id: product[0].dataValues.id }, offset, limit
                }) :
                await db.product_detail.findAll({
                    where: { product_id: pilihProduk }, offset, limit
                })
            console.log(getData)
            for await (const item of getData) {
                var angka1 = 0, angka2 = 0, angka3 = 0, angka4 = 0

                if (warehouse_id == 0) {
                    angka1 += await db.log_stock.sum('qty', {
                        where: {
                            product_detail_id: item.dataValues.id,status:{[Op.in]:['Additional','Cancelation']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }
                        }
                    })
                    angka2 += await db.log_stock.sum('qty', {
                        where: {
                            product_detail_id: item.dataValues.id,status:{[Op.in]:['Reduction','Sold']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }
                        }
                    })

                    angka3 += await db.log_stock.sum('qty', {
                        where: {
                            product_detail_id: item.dataValues.id, status:{[Op.in]:['Additional','Cancelation']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate()
                            }
                        }
                    })

                    angka4 += await db.log_stock.sum('qty', {
                        where: {
                            product_detail_id: item.dataValues.id,status:{[Op.in]:['Reduction','Sold']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate()
                            }
                        }
                    })
                } else {
                    angka1 += await db.log_stock.sum('qty', {
                        where: {
                            location_warehouse_id: warehouse_id, product_detail_id: item.dataValues.id, status:{[Op.in]:['Additional','Cancelation']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }
                        }
                    })
                    angka2 += await db.log_stock.sum('qty', {
                        where: {
                            location_warehouse_id: warehouse_id, product_detail_id: item.dataValues.id,status:{[Op.in]:['Reduction','Sold']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }
                        }
                    })

                    angka3 += await db.log_stock.sum('qty', {
                        where: {
                            location_warehouse_id: warehouse_id, product_detail_id: item.dataValues.id,status:{[Op.in]:['Additional','Cancelation']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate()
                            }
                        }
                    })

                    angka4 += await db.log_stock.sum('qty', {
                        where: {
                            location_warehouse_id: warehouse_id, product_detail_id: item.dataValues.id, status:{[Op.in]:['Reduction','Sold']}, createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate()
                            }
                        }
                    })
                }
                console.log(angka1, angka2, angka3, angka4)
                reduction.push(angka2)
                addition.push(angka1)
                f_addition.push(angka3)
                f_reduction.push(angka4)
            }
        }
        else if (code == 2) {
            page == 0 ? page = 1 : page
            var page_size = 5;
            var offset = (page - 1) * page_size;
            var limit = page_size;

            var category = await db.category.findAll()
            var product = await db.product.findAll({
                where: { category_id: pilihKategori }
            })

            if (warehouse_id == 0) {
                var total_count = pilihProduk == 0 ?
                    await db.log_stock.count({
                        where: {
                            createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }, product_id: product[0].dataValues.id, status:{[Op.in]:stetus}
                        }
                    })
                    :
                    await db.log_stock.count({
                        where: {
                            createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            },product_id: pilihProduk,status:{[Op.in]:stetus}
                        }
                    })

                    var getData = pilihProduk==0?
                    await db.log_stock.findAll({
                        where: {
                            createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }, product_id: product[0].dataValues.id,status:{[Op.in]:stetus}
                        },
                        include: [
                            { model: db.product_detail, include: { model: db.product } },
                            { model: db.location_warehouse }
                        ],
                        offset,
                        limit
                    })
                    :
                    await db.log_stock.findAll({
                        where: {
                            createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }, product_id: pilihProduk,status:{[Op.in]:stetus}
                        },
                        include: [
                            { model: db.product_detail, include: { model: db.product } },
                            { model: db.location_warehouse }
                        ],
                        offset,
                        limit
                    })

            } else {
                var total_count = pilihProduk == 0 ?
                    await db.log_stock.count({
                        where: {
                            createdAt: {
                                [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                                [Op.gte]: tanggal
                            }, location_warehouse_id: warehouse_id, product_id: product[0].dataValues.id,status:{[Op.in]:stetus}
                        }
                    }) 
                    :
                    await db.log_stock.count({ where: { createdAt:{
                       [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                       [Op.gte]: tanggal
                   },location_warehouse_id: warehouse_id,product_id:pilihProduk,status:{[Op.in]:stetus}} }) 


                   var getData = pilihProduk == 0 ?
                await db.log_stock.findAll({
                    where: {
                        createdAt: {
                            [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                            [Op.gte]: tanggal
                        },
                        location_warehouse_id: warehouse_id,
                        product_id: product[0].dataValues.id,status:{[Op.in]:stetus}

                    },
                    include: [
                        { model: db.product_detail, include: { model: db.product } },
                        { model: db.location_warehouse }
                    ],
                    offset,
                    limit
                })
                :
                await db.log_stock.findAll({
                    where: {
                        createdAt: {
                            [Op.lt]: moment(tanggal).add(1, 'month').toDate(),
                            [Op.gte]: tanggal
                        },
                        location_warehouse_id: warehouse_id,
                        product_id: pilihProduk,status:{[Op.in]:stetus}

                    },
                    include: [
                        { model: db.product_detail, include: { model: db.product } },
                        { model: db.location_warehouse }
                    ],
                    offset,
                    limit
                })
                
            }
            var total_pages = Math.ceil(total_count / page_size)            
        }

        res.status(201).send({
            isError: false,
            message: 'get data success',
            data: {
                getData, total_count, total_pages, category, product, addition, reduction, f_addition, f_reduction
            }
        })

    }
}