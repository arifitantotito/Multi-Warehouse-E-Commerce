const { sequelize } = require('./../models')
const { Op } = require('sequelize')
const moment = require('moment')
const db = require('./../models/index')

module.exports = {
        getDash: async(req,res)=>{
                let {warehouse_id} = req.query

                let today = moment(new Date()).format('MM/DD/YYYY')
                
                let active_transaction = warehouse_id==0?
                await db.transaction.count({
                        where:{
                                createdAt:{
                                        [Op.gte] : today,
                                        [Op.lt] : moment(today).add(1,'day').toDate()
                                },
                                order_status_id:{
                                        [Op.in]:[1,2,3]
                                }
                        }
                })
                :
                 await db.transaction.count({
                        where:{
                                location_warehouse_id :warehouse_id,
                                createdAt:{
                                        [Op.gte] : today,
                                        [Op.lt] : moment(today).add(1,'day').toDate()
                                },
                                order_status_id:{
                                        [Op.in]:[1,2,3]
                                }
                        }
                })

                let total_stock = warehouse_id==0?
                await db.location_product.sum('qty')
                :
                await db.location_product.sum('qty',{
                        where:{
                                location_warehouse_id:warehouse_id
                        }
                })

                let balances  = warehouse_id==0? await db.transaction.findAll({
                        where:{
                                order_status_id:5
                        },
                        include:{model:db.transaction_detail}
                })
                :
                await db.transaction.findAll({
                        where:{
                                order_status_id:5, location_warehouse_id:warehouse_id
                        },
                        include:{model:db.transaction_detail}
                })

                let getUserX = await db.user.count({where:{status:'Unverified'}})
                let getUser = await db.user.count()
                let getUserY = getUser - getUserX

                let getCategory = await db.category.findAll({
                        include:{model:db.transaction_detail, include:{model:db.transaction, where:{
                                order_status_id:5
                        }}}
                })

                let allCategory = [], allWarehouse = [], allProduct= []
                var total_qty = 0
                // console.log(getCategory[0].dataValues.transaction_details)
                
               
                getCategory.forEach((item,index)=>{
                        let qty = 0
                        item.dataValues.transaction_details.forEach((item,index)=>{
                                qty += item.dataValues.qty 
                                total_qty += item.dataValues.qty
                        })
                        allCategory.push({
                                category:item.dataValues.name,
                                qty
                        })
                })

                let getProduct = await db.product.findAll({include:[{model:db.transaction_detail, include:{model:db.transaction,where:{order_status_id:5}}}
                ,{model:db.product_image}
                ]})

                getProduct.forEach((item,index)=>{
                        let qty = 0
                        item.dataValues.transaction_details.forEach((item,index)=>{
                                qty += item.dataValues.qty
                        })
                        allProduct.push({'value': item.dataValues.id, 'label': item.dataValues.name, 'index': index+1, qty, 'image':item.dataValues.product_images[0].dataValues.img})
                })
                // let getWarehouse = await db.location_warehouse.findAll({include:{model:db.transaction, where:{order_status_id:5}, include:{model:db.transaction_detail}}})

                // getWarehouse.forEach((item,index)=>{
                //         let qty = 0 
                //         item.dataValues.transactions.forEach((item,index)=>{
                //                 item.dataValues.transaction_details.forEach((item,index)=>{
                //                         qty += item.dataValues.price*item.dataValues.qty
                //                 })
                //         })

                //         allWarehouse.push({
                //                 'value': item.dataValues.id, 'label': item.dataValues.city, 'index': index+1,
                //                 'qty':qty
                //         })
                // })

                // allWarehouse.sort((a,b)=> b.qty - a.qty)

                // let allWarehouse1 = []
                // allWarehouse.forEach((item,index)=> allWarehouse1.push({'value': item.value, 'label': item.label, 'index': index,'qty':item.qty}))
                // allWarehouse1.unshift({'value': 0, 'label': 'All Warehouse', 'index': 0})
                allProduct.sort((a,b)=>b.qty - a.qty)
                 let allProduct1= []
                allProduct.forEach((item,index)=> allProduct1.push({'value': item.value, 'label': item.label, 'index': index,'qty':item.qty, 'image':item.image}))
                console.log(allCategory, total_qty, allProduct1)
                res.status(201).send({
                        isError:false,
                        message:'get data success!',
                        data:{
                                active_transaction,total_stock,balances,
                                 getUser, getUserY,getUserX, allCategory, total_qty, allProduct1:allProduct1.slice(0,3)
                        }
                })
        }

}