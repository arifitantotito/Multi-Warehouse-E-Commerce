//import sequelize 
const { sequelize } = require('./../models')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');

const db = require('./../models/index')
// Import Delete Files
const deleteFiles = require('./../helpers/deleteFiles')

module.exports = {
    getAllProducts: async (req, res) => {
        try {
            let { name } = req.query
            let data = await db.category.findAll({
                where: {
                    name
                },
                include: {
                    model: db.product, include: {
                        model: db.product_detail
                    }
                }
            })
            res.status(201).send({
                isError: false,
                message: "Get All Products Success",
                data,
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    getProduct: async (req, res) => {
        try {
            let { page } = req.query
            let { category_id } = req.params
            // console.log(name);
            let data = await db.product.findAll({
                where: {
                    category_id
                },
                include:[{
                        model: db.product_detail
                    },
                {model: db.product_image}],
                order:[[{model: db.product_detail},'price', 'ASC']]

            })
            var limit = 8
            var pages = Math.ceil(data.length / limit)
            var offset = limit * (Number(page) - 1)

            let data2 = await db.product.findAll({
                where: {
                    category_id
                },
                include:[{
                        model: db.product_detail
                    },
                {model: db.product_image}],
                order:[[{model: db.product_detail},'price', 'ASC']],
                offset,
                limit

            })

            res.status(201).send({
                isError: false,
                message: "Get Product Success",
                data: data2,
                total: data.length,
                page: Number(page),
                pages: pages
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    getProductDetails: async (req, res) => {
        try {
            let { id } = req.params
            let data = await db.product.findAll({
                where: {
                    id
                },
                include: [{
                    model: db.product_detail, include:{
                        model: db.location_product
                    }
                },
                { model: db.product_image }]
            })
            console.log(data[0].product_details[0].location_products.length);
            // let arr = 0
            // for(let j = 0 ; j<data[0].product_details.length; j++){
            // // for (let i = 0; i < data[0].product_details[j].location_products.length; i++) {
            //     arr=data[0].product_details[j].location_products[j].qty+arr
            // }
            // console.log(arr);
            // await db.product_detail.update({
            //     qty: arr
            // }, {where:{
            //     product_id: id
            // }})
            res.status(200).send({
                isError: false,
                message: "Get Product Details Success",
                data: data
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    getCategory: async (req, res) => {
        try {
            let data = await db.category.findAll({
                include: {
                    model: db.product
                }
            })
            res.status(201).send({
                isError: false,
                message: "Get Product Category Success",
                data
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    getSelected: async (req, res) => {
        try {
            let { product_id, color, memory_storage } = req.params
            let data = await sequelize.query(
                'SELECT * FROM product_details WHERE (product_id = ? AND (color = ? AND memory_storage = ?))',
                {
                    replacements: [product_id, color, memory_storage],
                    type: QueryTypes.SELECT
                }
            );
            res.status(200).send({
                isError: false,
                message: "Get Selected Product Success",
                data
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    postCategory: async (req, res) => {
        try {
            let { name } = req.body

            let result = await db.category.findOne({
                where: {
                    name
                }
            })

            if (result) {
                res.status(400).send({
                    isError: true,
                    message: "Category Already Exist"
                })
            } else if (!name) {
                res.status(400).send({
                    isError: true,
                    message: "Category Name Cannot Empty"
                })
            } else {
                let data = await db.category.create({ name })
                res.status(201).send({
                    isError: false,
                    message: "Post Category Success",
                    data
                })
            }
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    editCategory: async (req, res) => {
        try {
            let { id, name } = req.body
            let result = await db.category.findOne({
                where: {
                    name
                }
            })
            if (result) {
                res.status(400).send({
                    isError: true,
                    message: "Category Already Exist"
                })
            } else if (!name) {
                res.status(400).send({
                    isError: true,
                    message: "New Category Cannot Empty"
                })
            } else {
                await db.category.update({ id, name }, {
                    where: {
                        id
                    }
                })
                res.status(201).send({
                    isError: false,
                    message: "Edit Category Success"
                })
            }

        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    deleteCategory: async (req, res) => {
        try {
            let { id } = req.body
            await db.category.destroy({
                where: {
                    id
                }
            })
            res.status(201).send({
                isError: false,
                message: "Delete Category Success"
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    addProduct: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let dataToCreate = JSON.parse(req.body.data)
            // console.log(dataToCreate);
            let response = await db.product.create({ ...dataToCreate, name: dataToCreate.name, description: dataToCreate.description, category_id: dataToCreate.category_id })
            // console.log(response);

            let find = await db.product.findOne({
                where: {
                    name: dataToCreate.name
                }
            }, { transaction: t })
            // console.log(find.dataValues.id, "INI ID PRODUCT")

            // let data = await db.product_detail.create({ price: dataToCreate.price, memory_storage: dataToCreate.memory_storage, color: dataToCreate.color, colorhex: dataToCreate.colorhex, qty: dataToCreate.qty, product_id: find.dataValues.id })
            let photo = await db.product_image.create({ img: req.files.images[0].path.split("/")[req.files.images[0].path.split("/").length-1], product_id: find.dataValues.id })
            console.log(req.files.images[0].path.split("/")[req.files.images[0].path.split("/").length-1])
            console.log(req.files.images)
            await t.commit()
            res.status(201).send({
                isError: false,
                message: "Add Product Success"
            })
        } catch (error) {
            await t.rollback()
            deleteFiles(req.files)
            // console.log(error)
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    getCategoryDetail: async (req, res) => {
        try {
            let { id } = req.body
            let find = await db.product_detail.findOne({
                where: {
                    id
                }
            })

            // console.log(find.dataValues.product_id);

            let findTwo = await db.product.findOne({
                where: {
                    id: find.dataValues.product_id
                }
            })
            // console.log(findTwo.dataValues.category_id);

            let findThree = await db.category.findOne({
                where: {
                    id: findTwo.dataValues.category_id
                }
            })
            // console.log(findThree.dataValues.name);
            res.status(201).send({
                isError: false,
                message: "Get Id success",
                data: findThree
            })
        } catch (error) {

        }
    },
    updateProduct: async (req, res) => {
        try {
            // let {name, id, description, price, storage, color, qty} = req.body
            let { id, name, description, category_id } = req.body

            await db.product.update({ name, description, category_id }, {
                where: {
                    id
                }
            })
            res.status(201).send({
                isError: false,
                message: "Update Product Success"
            })
        } catch (error) {

        }
    },
    updateProductDetail: async (req, res) => {
        try {
            let { id, qty, price, memory_storage, color, colorhex, product_id } = req.body
            await db.product_detail.update({ id, qty, price, memory_storage, color, colorhex, product_id }, {
                where: {
                    id
                }
            })
            // await t.commit()
            res.status(201).send({
                isError: false,
                message: "Update Product Detail Success"
            })
        } catch (error) {
            // console.log(error)
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    updateProductDetailImage: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let dataToCreate = JSON.parse(req.body.data)

            await db.product_detail.update({ ...dataToCreate, qty: dataToCreate.qty, price: dataToCreate.price, memory_storage: dataToCreate.memory_storage, color: dataToCreate.color, colorhex: dataToCreate.colorhex }, {
                where: {
                    id: dataToCreate.id
                }
            }, { transaction: t })
            await db.product_image.update({ img: req.files.images[0].path.split("/")[2] }, {
                where: {
                    product_id: dataToCreate.product_id
                }
            }, { transaction: t })
            await t.commit()
            res.status(201).send({
                isError: false,
                message: "Update Product Detail and Image Success"
            })
        } catch (error) {
            await t.rollback()
            deleteFiles(req.files)
            // console.log(error)
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            let { id } = req.body
            await db.product.destroy({
                where: {
                    id
                }
            })
            res.status(201).send({
                isError: false,
                message: "Delete Product Success"
            })
        } catch (error) {

        }
    },
    deleteProductDetail: async (req, res) => {
        try {
            let { id } = req.body
            await db.product_detail.destroy({
                where: {
                    id
                }
            })
            res.status(201).send({
                isError: false,
                message: "Delete Product Detail Success"
            })
        } catch (error) {

        }
    },
    // getColor: async(req, res)=>{
    //     try {
    //         let {color, colorhex} = req.body
    //         // console.log(name);
    //         let data = await db.product_detail.update({colorhex},{
    //             where: {
    //                 color
    //             }
    //         })
    //         console.log(data);
    //         res.status(201).send({
    //             isError: false,
    //             message: "Get Product Success",
    //             data
    //         })
    //     } catch (error) {
    //         res.status(401).send({
    //             isError: true,
    //             message: error.message,
    //             data: error
    //         })
    //     }
    // },
    getProducts: async(req, res)=>{
        try {
            let { page } = req.query
            // console.log(page);
            let data = await db.product_detail.findAll({
                // include:{
                //     model: db.product_detail
                // }
            })

            var limit = 10
            var pages = Math.ceil(data.length / limit)
            var offset = limit * (Number(page) - 1)

            let data1 = await db.product_detail.findAll({
                include: {
                    model: db.product
                },
                offset,
                limit
            })
            return res.status(200).send({
                isError: false,
                message: "Get every Product Success",
                data: data1,
                total: data.length,
                page: Number(page),
                pages: pages
            });
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    getProductsAdmin: async (req, res) => {
        try {
            let { category_id } = req.params
            // let {page} = req.query
            // console.log(name);
            let data = await db.product.findAll({
                where: {
                    category_id
                },
                include: [{
                    model: db.product_detail
                },
                { model: db.product_image }]
            })
            // var limit = 3
            // var pages = Math.ceil(data.length / limit)
            // var offset = limit * (Number(page) - 1)

            // let data1 = await db.product_detail.findAll({
            //     include:{
            //         model: db.product,
            //     where: {
            //         category_id
            //     },
            //     include:[{
            //             model: db.product_detail
            //         },
            //     {model: db.product_image}]
            //     },
            //     offset,
            //     limit
            // })

            res.status(201).send({
                isError: false,
                message: "Get Product Success",
                data,
                // data: data1, 
                // total: data.length, 
                // page: Number(page),
                // pages: pages
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    getSortName: async(req, res)=>{
        try {
            let {category_id} = req.params
            let {color} = req.body
            let { sort, page } = req.query;
            if (sort === "az") {
            try {
                let data = await db.product.findAll({
                    where:{
                        category_id
                    }, order: [
                        ['name', 'ASC'],
                    ], include:[{
                        model: db.product_detail
                    },
                {model: db.product_image}]
                });
                // var limit = 4
                // var pages = Math.ceil(data.length / limit)
                // var offset = limit * (Number(page) - 1)

                // let data2 = await db.product.findAll({
                //     where:{
                //         category_id
                //     }, order: [
                //         ['name', 'ASC'],
                //     ], include:[{
                //         model: db.product_detail
                //     },
                // {model: db.product_image}],
                // offset,
                // limit
                // });

                return res.status(201).send({
                isError: false,
                message: "Sort A-Z Success",
                data,
                // total: data.length,
                // page: Number(page),
                // pages: pages
                });
            } catch (error) {
                return res.status(400).send({
                isError: true,
                message: error.message,
                data: error,
                });
            }
            } else if (sort === "za") {
            try {
                let data = await db.product.findAll({
                    where:{
                        category_id
                    }, order: [
                        ['name', 'DESC'],
                    ], include:[{
                        model: db.product_detail
                    },
                {model: db.product_image}]});

                // var limit = 4
                // var pages = Math.ceil(data.length / limit)
                // var offset = limit * (Number(page) - 1)

                // let data2 = await db.product.findAll({
                //     where:{
                //         category_id
                //     }, order: [
                //         ['name', 'DESC'],
                //     ], include:[{
                //         model: db.product_detail
                //     },
                //     {model: db.product_image}],
                //     offset,
                //     limit
                // });
                return res.status(201).send({
                isError: false,
                message: "Sort Z-A Success",
                data,
                // total: data.length,
                // page: Number(page),
                // pages: pages
                });
            } catch (error) {
                return res.status(400).send({
                isError: true,
                message: error.message,
                data: error,
                });
            }
        }else if(sort === "lohi"){
            let data = await db.product_detail.findAll({
                include:[{
                    model: db.product,where: {
                        category_id
                    }, include:{
                        model: db.product_image
                    }
                },],
            })
            
            let arr = []
            var arr2 = []
                for (let i = 0; i < data.length; i++) {
                    if (!arr.includes(data[i].product_id)) {
                        arr2.push(data[i])
                        arr.push(data[i].product_id)
                    }
                }

                // var limit = 4
                // var pages = Math.ceil(arr2.length / limit)
                // var offset = limit * (Number(page) - 1)

                // // let data2 = ({include:{arr2},offset, limit})

                // let data2 = ({
                //     include:[{
                //         model: arr2
                //     }],
                //     offset,
                //     limit
                // })
            

            // // console.log("BISMILLAH",arr2)
            // console.log(arr2.length);
            // console.log("HAAAIIII",data[1])
            res.status(201).send({
                isError: false,
                message: "Get Product Success",
                data: arr2,
                // total: data.length,
                // page: Number(page),
                // pages: pages
            })
        }else if(sort === "hilo"){
            let data = await db.product_detail.findAll({
                include:[{
                        model: db.product,where: {
                            category_id
                        }, include:{
                            model: db.product_image
                        }
                    },],
                order:[['price', 'DESC']]
            })

            // var limit = 4
            // var pages = Math.ceil(data.length / limit)
            // var offset = limit * (Number(page) - 1)

            // let data2 = await db.product_detail.findAll({
            //     include:[{
            //             model: db.product,where: {
            //                 category_id
            //             }, include:{
            //                 model: db.product_image
            //             }
            //         },],
            //     order:[['price', 'DESC']],
            //     offset,
            //     limit
            // })

            let arr = []
            let arr2 = []
                for (let i = 0; i < data.length; i++) {
                    if (!arr.includes(data[i].product_id)) {
                        arr2.push(data[i])
                        arr.push(data[i].product_id)
                    }
                }
            // console.log("BISMILLAH",arr)
            // console.log("HAAAIIII",data[1])
            res.status(201).send({
                isError: false,
                message: "Get Product Success",
                data: arr2,
                // total: data.length,
                // page: Number(page),
                // pages: pages
            })
        }else if(sort === color){
            let data = await db.product_detail.findAll({
                include:[{
                        model: db.product,where: {
                            category_id
                        }, include:{
                            model: db.product_image
                        }
                    },],
                where:{
                    color
                }
            })

            // var limit = 4
            // var pages = Math.ceil(data.length / limit)
            // var offset = limit * (Number(page) - 1)

            // let data2 = await db.product_detail.findAll({
            //     include:[{
            //             model: db.product,where: {
            //                 category_id
            //             }, include:{
            //                 model: db.product_image
            //             }
            //         },],
            //     where:{
            //         color
            //     },
            //     offset,
            //     limit
            // })
            // let arr = []
            // let arr2 = []
            //     for (let i = 0; i < data.length; i++) {
            //         if (!arr.includes(data[i].product_id)) {
            //             arr2.push(data[i])
            //             arr.push(data[i].product_id)
            //         }
            //     }
            // console.log("BISMILLAH",arr)
            // console.log("HAAAIIII",data[1])
            res.status(201).send({
                isError: false,
                message: "Get Product Success",
                data,
                // total: data.length,
                // page: Number(page),
                // pages: pages
            })
        }
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: error,
                });
        }
    },
    postSortColor: async(req, res)=>{
        try {
            let {category_id} = req.params
            let {color} = req.body
            let data = await db.product_detail.findAll({
                include:[{
                        model: db.product,where: {
                            category_id
                        }, include:{
                            model: db.product_image
                        }
                    },],
                where:{
                    color
                }
            })
            let arr = []
            let arr2 = []
                for (let i = 0; i < data.length; i++) {
                    if (!arr.includes(data[i].product_id)) {
                        arr2.push(data[i])
                        arr.push(data[i].product_id)
                    }
                }
            // console.log("BISMILLAH",arr)
            // console.log("HAAAIIII",data[1])
            res.status(201).send({
                isError: false,
                message: "Get Product Success",
                data: arr2
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: error,
                });
        }
    },
    getColor: async(req, res)=>{
        try {
            let {category_id} = req.params
            let data = await db.product_detail.findAll({
                // group: ['color'],
                include:[{
                    model: db.product,where:{
                        category_id
                    }
                }]
            })
            let arr = []
            let arr2 = []
            for (let i = 0; i < data.length; i++) {
                if (!arr.includes(data[i].color)) {
                    arr2.push(data[i])
                    arr.push(data[i].color)
                }
            }
            // console.log("BISMILLAH",arr)
            res.status(201).send({
                isError: false,
                message: "Get Color Success",
                data: arr2
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: error,
                });
        }
    },
    getDetailQty: async(req, res)=>{
        try {
            let {id} = req.params
            let data = await db.location_product.findAll({
                where:{
                    product_detail_id: id
                }
            })
            let arr = 0
            for (let i = 0; i < data.length; i++) {
                arr=data[i].qty+arr
            }
            // await db.product_detail.update({
            //     qty: arr
            // },{where:{
            //     id
            // }})
            res.status(201).send({
                isError: false,
                message: "Get Color Success",
                data: arr
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: error,
                });
        }
    },
    getName: async(req, res)=>{
        try {
            let data = await db.product.findAll()
            res.status(201).send({
                isError: false,
                message: "Get Product Name Success",
                data
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: error,
            });
        }
    },
    addProductDetail: async (req, res) => {
        try {
            let {product_id, price, memory_storage, color, colorhex} = req.body
            let response = await db.product_detail.create({ product_id, price, memory_storage, color, colorhex })
            res.status(201).send({
                isError: false,
                message: "Add Product Success"
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    },
    updateQtyPro: async(req, res)=>{
        try {
            let data = await db.location_product.findAll({
                attributes:[
                    [sequelize.fn('sum', sequelize.col('qty')),'total_qty'],
                    'product_detail_id'
                ],
                group:'product_detail_id'
            })
            data.forEach(async(value)=>{
                await db.product_detail.update({qty: value.dataValues.total_qty}, {where:{
                    id: value.product_detail_id
                }})
            })
            res.status(201).send({
                isError: false,
                message: "Get Count Success",
                data
            })
        } catch (error) {
            res.status(401).send({
                isError: true,
                message: error.message,
                data: error
            })
        }
    }
}
