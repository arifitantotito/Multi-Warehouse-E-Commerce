//import sequelize 
const { sequelize } = require('../models')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')

//import models
const db = require('./../models/index')

//import hashing
const { hashPassword, hashMatch } = require('../lib/hashpassword');
//import jwt
const { createToken } = require('../lib/jwt');

const deleteFiles = require('./../helpers/deleteFiles')
const fs = require('fs')

module.exports = {
    register: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let { email, password, name, location_warehouse_id, phone_number, gender } = req.body

            let matchdata = await db.admin.findOne({
                where: {
                    [Op.or]: [{ email }, { name }]
                }
            })

            if (matchdata) throw { message: 'Email or Name has been used' }

            let newSuper = await db.admin.create({ id: uuidv4(), password: await hashPassword(password), email, name, phone_number, gender, location_warehouse_id, role: 2 }, { transaction: t })

            await t.commit()
            res.status(201).send({
                message: 'Register Success',
                data: newSuper
            })
        } catch (error) {
            await t.rollback()
            res.status(404).send({
                message: error.message,
                data: null
            })
        }
    },
    getAllAdmin: async (req, res) => {
        let { page,search } = req.query
        const page_size = 5;
        const offset = (page - 1) * page_size;
        const limit = page_size;

        const total_count = await db.admin.count({ where: { role: 2
            ,
            [Op.or]: [
                { email: { [Op.startsWith]: search} },
                { name: { [Op.startsWith]: search} }
            ]
        } })
        const total_pages = Math.ceil(total_count / page_size)

        try {
            let allData = await db.admin.findAll({
                where: {
                    role: 2,
                    [Op.or]: [
                        { email: { [Op.startsWith]: search} },
                        { name: { [Op.startsWith]: search} }
                    ]
                },
                include: [{ model: db.location_warehouse }], offset, limit
            })
            let loader = allData.map((item, index) => {
                return (
                    {
                        id: item.dataValues.id ? item.dataValues.id : null,
                        name: item.dataValues.name ? item.dataValues.name : null,
                        email: item.dataValues.email ? item.dataValues.email : null,
                        gender: item.dataValues.gender ? item.dataValues.gender : null,
                        photo_profile: item.dataValues.photo_profile ? item.dataValues.photo_profile : null,
                        phone_number: item.dataValues.phone_number ? item.dataValues.phone_number : null,
                        role: item.dataValues.role ? item.dataValues.role : null,
                        location_warehouse_id: item.dataValues.location_warehouse_id ? item.dataValues.location_warehouse_id : null,
                        location_warehouse: item.dataValues.location_warehouse ? item.dataValues.location_warehouse.dataValues.city : null
                    }
                )
            })

            res.status(201).send({
                isError: false,
                message: 'Get Data Success!',
                data: {
                    loader,
                    total_count,
                    total_pages,page_size
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

    adminLogin: async (req, res) => {
        try {
            let { email, password } = req.body
            // console.log(password)

            if (!email || !password) throw { message: 'Please Fill All Data!' }

            let dataAdmin = await db.admin.findOne({
                where: {
                    email
                },
                include: [{ model: db.location_warehouse }]
            })
            if (!dataAdmin) throw { message: 'Data Not Found!' }
            let matchPassword = await hashMatch(password, dataAdmin.dataValues.password)

            if (matchPassword === false) throw { message: 'Password wrong!' }

            let token = await createToken({ id: dataAdmin.id })

            res.status(201).send({
                isError: false,
                message: 'Login Success!',
                data:
                {
                    'username': `${dataAdmin.name}`,
                    'token': token,
                    'role': `${dataAdmin.role}`,
                    'warehouse': dataAdmin.location_warehouse_id ?
                        dataAdmin.location_warehouse.city : null,
                    'warehouse_id': dataAdmin.location_warehouse_id ?
                        dataAdmin.location_warehouse_id : null,
                    'photo_profile': dataAdmin.photo_profile ? dataAdmin.photo_profile : null
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
    getAllUser: async (req, res) => {
        let { page, code, inputSearch } = req.query
        const page_size = 5;
        const offset = (page - 1) * page_size;
        const limit = page_size;

        if (code == 1) {

            var total_count = await db.user.count({
                where:{
                    [Op.or]: [
                        { email: { [Op.startsWith]: inputSearch} },
                        { name: { [Op.startsWith]: inputSearch} },
                        {phone_number: { [Op.startsWith]: inputSearch} },
                    ]
                }
            })
            var total_pages = Math.ceil(total_count / page_size)
            var allUser = await db.user.findAll({
                where:{
                    [Op.or]: [
                        {phone_number: { [Op.startsWith]: inputSearch} },
                        { email: { [Op.startsWith]: inputSearch} },
                        { name: { [Op.startsWith]: inputSearch} }
                    ]
                },
                offset, limit
            })

        } else if (code == 2) {

            var total_count = await db.admin.count({ where: { role: 2,
                [Op.or]: [
                    { email: { [Op.startsWith]: inputSearch} },
                    { name: { [Op.startsWith]: inputSearch} },
                    { phone_number: { [Op.startsWith]: inputSearch} }
                ]
             }})
            var total_pages = Math.ceil(total_count / page_size)
            var allAdmin = await db.admin.findAll({
                where: {
                    role: 2,
                    [Op.or]: [
                        { phone_number: { [Op.startsWith]: inputSearch} },
                        { name: { [Op.startsWith]: inputSearch} },
                        { email: { [Op.startsWith]: inputSearch} }
                    ]
                },
                include: { model: db.location_warehouse}
                ,
                offset, limit
            })
        }
        res.status(201).send({
            isError: false,
            message: 'get data success',
            data: {
                response: allUser ? allUser : allAdmin,
                total_count,
                total_pages, page_size
            }
        })
    },
    findAdmin: async (req, res) => {
        let { id } = req.body

        let data = await db.admin.findOne({
            where: {
                id
            }
        })

        if (!data) return res.status(404).send({
            isError: true,
            message: 'id not found',
            data: null
        })

        res.status(201).send({
            isError: false,
            message: 'id found!',
            data: data
        })
    },
    update: async (req, res) => {
        try {

            let { id, email, name, gender, phone_number, location_warehouse_id, password } = req.body

            if (!name || !email) throw { message: 'Name or Email Empty!' }

            // let matchData = await db.admin.findOne({
            //     where:{
            //         [Op.and]:[
            //             {email},{name}
            //         ]
            //     }
            // }) 
            // if(matchData) throw {message:'Email or Name has been used!'} 

            if (password.length == 0) {
                await db.admin.update({
                    email, name, phone_number, location_warehouse_id, gender
                },
                    {
                        where: {
                            id
                        }
                    }
                )
            } else {
                await db.admin.update({
                    email, name, phone_number, location_warehouse_id, gender, password: await hashPassword(password)
                },
                    {
                        where: {
                            id
                        }
                    }
                )
            }

            res.status(201).send({
                isError: false,
                message: 'update success!'
            })
        } catch (error) {

            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    delete: async (req, res) => {
        let { id } = req.body
        let deleteAdmin = await db.admin.destroy({
            where: {
                id
            }
        })
        res.status(201).send({
            isError: false,
            message: 'Admin Deleted!',
        })
    },
    keep_login: async (req, res) => {

        let getToken = req.dataToken

        // console.log(getToken)


        let getDataUser = await db.user.findOne({
            where: {
                id: getToken.id
            }
        })
        // console.log(getDataUser)
        if (!getDataUser) {
            getDataUser = await db.admin.findOne({
                where: {
                    id: getToken.id
                },
                include: [{ model: db.location_warehouse }]
            })
        }
        // console.log(getDataUser)
        res.status(201).send({
            isError: false,
            message: 'token still valid',
            data: {
                token: getToken,
                username: getDataUser.name,
                role: getDataUser.role,
                warehouse: getDataUser.location_warehouse_id ?
                    getDataUser.location_warehouse.city : null,
                warehouse_id: getDataUser.location_warehouse_id ?
                    getDataUser.location_warehouse_id : null,
                photo_profile: getDataUser.photo_profile ? getDataUser.photo_profile : null,
                role: getDataUser.role ? getDataUser.role : null,
                warehouse: getDataUser.location_warehouse_id ?
                    getDataUser.location_warehouse.city : null
            }
        })
    },
    updateAdminPhoto: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let getToken = req.dataToken
            // console.log(getToken)

            let findAdmin = await db.admin.findOne({ where: { id: getToken.id } })
            console.log(findAdmin)
            fs.unlink(findAdmin.dataValues.photo_profile, function (err) {
                try {
                    if (err) throw err
                } catch (error) {
                    console.log(error)
                }
            })

            let profilePicture = await db.admin.update({ photo_profile: req.files.images[0].path }, {
                where: {
                    id: getToken.id
                }
            }, { transaction: t })

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Update Photo Profile Success!',
                // data: profilePicture
            })

        } catch (error) {
            // await t.rollback()
            deleteFiles(req.files)
            console.log(error)
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
}