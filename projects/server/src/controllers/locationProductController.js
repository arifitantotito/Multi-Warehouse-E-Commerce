//import sequelize 
const {sequelize} = require('./../models')
const { Op } = require('sequelize')
const {v4:uuidv4} = require('uuid');
const { QueryTypes } = require('sequelize');

const db = require('./../models/index')
// Import Delete Files
const deleteFiles = require('./../helpers/deleteFiles')

module.exports= {
    getLocation: async(req, res)=>{
        try {
            let data = await db.location_warehouse.findAll({})
            res.status(200).send({
                isError: false,
                message: "Get Location Success",
                data
            })
        } catch (error) {
            res.status(400).send({
                isError: false,
                message: error.message,
                data: null
            })
        }
    },
    getLocationProduct: async(req, res)=>{
        try {
            let {location_warehouse_id} = req.params
            let {page} = req.query
            console.log(page);
            let data = await db.location_product.findAll({
                where:{
                    location_warehouse_id
                },include:{
                    model: db.product_detail,include:{
                        model: db.product
                    }
                }
            })
            var limit = 10
            var pages = Math.ceil(data.length / limit)
            var offset = limit * (Number(page) - 1)

            let data1 = await db.location_product.findAll({
                where:{
                    location_warehouse_id
                },include:{
                    model: db.product_detail,include:{
                        model: db.product
                    }
                },
                offset,
                limit
            })

            console.log(data1[0].dataValues.location_warehouse_id);
            let response = await db.location_warehouse.findAll({
                where:{
                    id: data1[0].dataValues.location_warehouse_id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Get Location Product Success",
                response: response,
                data: data1, 
                total: data.length, 
                page: Number(page),
                pages: pages
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getQuantity: async(req, res)=>{
        try {
            let {id} = req.body
            let data = await db.location_product.findOne({
                where:{
                    id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Get Quantity Success",
                data
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    updateStock: async(req, res)=>{
        try {
            let {id, qty} = req.body
            await db.location_product.update({qty},{
                where:{
                    id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Update Stock Success",
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    postStock: async(req, res)=>{
        try {
            let {qty, status, location_warehouse_id, product_detail_id, product_id} = req.body
            let data = await db.log_stock.create({qty, status, location_warehouse_id, product_detail_id, product_id})
            res.status(200).send({
                isError: false,
                message: "Post Stock Success",
                data
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getDetailWarehouse: async(req, res)=>{
        try {
            let {location_warehouse_id} = req.body
            let data = await db.location_product.findAll({
                where:{
                    location_warehouse_id
                },include:[{
                    model: db.product_detail,include:{
                        model: db.product
                    }
                },{model:db.location_warehouse}]
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Detail Warehouse Success",
                data: data,
            })
            
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getDetailCategory: async(req, res)=>{
        try {
            let data = await db.category.findAll({})
            res.status(200).send({
                isError: false,
                message: "Get Product Detail Category Success",
                data: data,
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getDetailName: async(req, res)=>{
        try {
            let {location_warehouse_id, category_id} = req.body
            let data = await db.location_product.findAll({
                where:{
                    location_warehouse_id
                },include:[{
                    model: db.product_detail,include:{
                        model: db.product, where:{
                            category_id
                        }
                    }
                },{model:db.location_warehouse}]
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Detail Name Success",
                data: data,
            })
            
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getSpec: async(req, res)=>{
        try {
            let {location_warehouse_id, category_id, product_id} = req.body
            let data = await db.location_product.findAll({
                where:{
                    location_warehouse_id
                },include:[{
                    model: db.product_detail, where:{
                        product_id
                    },include:{
                        model: db.product, where:{
                            category_id
                        }
                    }
                },{model:db.location_warehouse}]
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Spec Success",
                data: data,
            })
            
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getDetailLast: async(req, res)=>{
        try {
            let {location_warehouse_id, category_id, product_id} = req.body
            let data = await db.location_product.findAll({
                where:{
                    location_warehouse_id
                },include:[{
                    model: db.product_detail, where:{
                        product_id
                    },include:{
                        model: db.product, where:{
                            category_id
                        }
                    }
                },{model:db.location_warehouse}]
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Detail Success",
                data: data,
            })
            
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getName: async(req, res)=>{
        try {
            let {category_id} = req.body
            let data = await db.product.findAll({
                where:{
                    category_id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Success",
                data: data,
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getQty: async(req, res)=>{
        try {
            let {location_warehouse_id, product_detail_id} = req.body
            let data = await db.location_product.findOne({
                where:{
                    location_warehouse_id,
                    product_detail_id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Success",
                data: data,
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    postLog: async(req, res)=>{
        try {
            let {qty, order_status_id, product_detail_id, location_warehouse_id_origin, location_warehouse_id_target} = req.body
            let data = await db.location_product.findOne({
                where:{
                    product_detail_id
                }
            })
            console.log(data.dataValues.id);

            let data2 = await db.log_request.create({location_product_id_target: data.dataValues.id, qty, order_status_id, product_detail_id, location_warehouse_id_origin, location_warehouse_id_target})

            res.status(200).send({
                isError: false,
                message: "Post Product Success",
                data: data2,
            })
            
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    updateLog: async(req, res)=>{
        try {
            let {id, product_detail_id, location_warehouse_id} = req.body
            let data = await db.location_product.findOne({
                where:{
                    product_detail_id,
                    location_warehouse_id
                }
            })
            console.log(data.dataValues.id);

            let data2 = await db.log_request.update({location_product_id_origin: data.dataValues.id}, {
                where:{
                    id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Post Product Success",
                data: data2,
            })
            
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getMutation: async(req, res)=>{
        try {
            let { page } = req.query
            let {location_warehouse_id_origin} = req.params
            let data = await db.log_request.findAll({
                where:{
                    location_warehouse_id_origin
                }, 
                include:[{
                    model: db.product_detail, include:{
                        model: db.product, include:[{
                            model: db.category
                        },{model: db.product_image}]
                    }
                },{model: db.order_status}]
            })
            var limit = 3
            var pages = Math.ceil(data.length / limit)
            var offset = limit * (Number(page) - 1)
            let data1 = await db.log_request.findAll({
                where:{
                    location_warehouse_id_origin
                }, 
                include:[{
                    model: db.product_detail, include:{
                        model: db.product, include:[{
                            model: db.category
                        },{model: db.product_image}]
                    }
                },{model: db.order_status}],
                offset,
                limit
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Success",
                data: data1,
                total: data.length,
                page: Number(page),
                pages: pages
                
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getRequest: async(req, res)=>{
        try {
            let {location_warehouse_id_target} = req.params
            let {order_status_id} = req.body
            let data = await db.log_request.findAll({
                where:{
                    location_warehouse_id_target, order_status_id
                }, 
                include:[{
                    model: db.product_detail, include:{
                        model: db.product, include:[{
                            model: db.category
                        },{model:db.product_image}]
                    }
                },{model: db.order_status}]
            })
            // console.log(data[0].dataValues.location_product_id_origin);
            res.status(200).send({
                isError: false,
                message: "Get Product Success",
                data: data
                
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    confirmProduct: async(req, res)=>{
        try {
            let {id, qty, order_status_id, location_warehouse_id, product_detail_id, location_warehouse_id_target, product_id} = req.body
            let data = await db.log_request.findOne({where:{id}})
            await db.log_request.update({order_status_id},{
                where:{
                    id
                }
            })
            await db.log_stock.create(
                {
                    qty,
                    status: 'Reduction',
                    location_warehouse_id,
                    product_detail_id,
                    product_id
                }),
            await db.log_stock.create(
                {
                    qty,
                    status: 'Additional',
                    location_warehouse_id: location_warehouse_id_target,
                    product_detail_id,
                    product_id
                })
                await db.log_request.update({order_status_id},{
                    where:{
                        id
                    }
                })
            
            res.status(200).send({
                isError: false,
                message: "Update Status Log Request Success",
                data: data
                
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    updateProductQty: async(req, res)=>{
        try {
            let {id, qty, id_target} = req.body
            let data = await db.location_product.findOne({
                where:{
                    id
                }
            })
            let data3 = await db.location_product.findOne({
                where:{
                    id: id_target
                }
            })
            console.log(data.dataValues.qty);
            await db.location_product.update({qty: data.dataValues.qty + Number(qty)},{where: {id}})
            let data2 = await db.location_product.findOne({
                where:{
                    id
                }
            })
            await db.location_product.update({qty: data3.dataValues.qty - Number(qty)},{where: {id: id_target}})
            // let data3 = await db.location_product.findOne({
            //     where:{
            //         id: id_target
            //     }
            // })
            res.status(200).send({
                isError: false,
                message: "Get Location Product Success",
                data: data2
                
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getConfirm: async(req, res)=>{
        try {
            let {location_warehouse_id_target} = req.params
            let {order_status_id} = req.body
            let data = await db.log_request.findAll({
                where:{
                    location_warehouse_id_target, order_status_id
                }, 
                include:[{
                    model: db.product_detail, include:{
                        model: db.product, include:[{
                            model: db.category
                        },{model:db.product_image}]
                    }
                },{model: db.order_status},{model: db.location_warehouse, where:{
                    id: 5
                }}]
            })
            // console.log(data[0].dataValues.location_product_id_origin);
            res.status(200).send({
                isError: false,
                message: "Get Product Success",
                data: data
                
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    postCancel: async(req, res)=>{
        try {
            let {id, order_status_id} = req.body
            let data = await db.log_request.findOne({where:{id}})
            await db.log_request.update({order_status_id},{
                where:{
                    id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Get Location Product Success",
                data: data
                
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getNameDetail: async(req, res)=>{
        try {
            let {product_id} = req.body
            let data = await db.product_detail.findAll({
                where:{
                    product_id
                }
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Detail Success",
                data: data,
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    postProductWarehouse: async(req, res)=>{
        try {
            let {qty, location_warehouse_id, product_detail_id, status} = req.body
            let data = await db.location_product.create({qty, location_warehouse_id, product_detail_id})
            let data2 = await db.product_detail.findOne({
                id: product_detail_id
            })
            let data3 = await db.log_stock.create({qty, status, product_id: data2.dataValues.product_id, location_warehouse_id, product_detail_id})
            res.status(200).send({
                isError: false,
                message: "Post Location Product Success",
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getFilterMutation: async(req, res)=>{
        try {
            let {location_warehouse_id_origin, order_status_id} = req.params
            let data = await db.log_request.findAll({
                where:{
                    location_warehouse_id_origin,
                    order_status_id
                }, 
                include:[{
                    model: db.product_detail, include:{
                        model: db.product, include:[{
                            model: db.category
                        },{model: db.product_image}]
                    }
                },{model: db.order_status}]
            })
            res.status(200).send({
                isError: false,
                message: "Get Product Success",
                data: data
                
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}