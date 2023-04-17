//import sequelize 
const { sequelize } = require('./../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path = require("path");

const axios = require('axios');

//import models
const db = require('./../models/index');
const users = db.user;


//import hashing
const { hashPassword, hashMatch } = require('../lib/hashpassword');

//import jwt
const { createToken } = require('../lib/jwt');

// Import Delete Files
const deleteFiles = require('./../helpers/deleteFiles');

// Import transporter
const transporter = require('./../helpers/transporter');



const fs = require('fs').promises

const handlebars = require('handlebars');
const { match } = require('assert');
module.exports = {
    register: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let { name, email, phone_number } = req.body

            if (!name || !email || !phone_number) throw { message: "Please fill your data" }

            let dataEmail = await db.user.findOne({
                where: {
                    email
                }
            })

            if (dataEmail) throw { message: 'Email already registered' }

            if (isNaN(phone_number)) throw { message: "Please input a number" }

            if (phone_number.length < 8 || phone_number.length > 13) throw { message: 'Please input your valid phone number' }

            let resCreateUsers = await users.create({ id: uuidv4(), name, email, phone_number, password: await hashPassword('Abcde12345'), status: 'Unverified' }, { transaction: t })
            // console.log(resCreateUsers)

            const template = await fs.readFile(path.resolve(__dirname, '../template/confirmation.html'), 'utf-8')
            const templateToCompile = await handlebars.compile(template)
            const newTemplate = templateToCompile({ name, email, url: `https://jcwd230201.purwadhikabootcamp.com/activation/${resCreateUsers.dataValues.id}` })
            await transporter.sendMail({
                from: 'iFrit',
                to: email,
                subject: 'Account Activation',
                html: newTemplate
            })

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Register Success',
                data: resCreateUsers
            })

        } catch (error) {
            await t.rollback()
            // console.log(error)
            res.status(401).send({
                isError: true,
                message: error.message,
            })
        }
    },
    activation: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let { id } = req.params
            let { password } = req.body

            if (password.length < 8) throw { message: 'Password at least has 8 characters' }

            let character = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
            if (!character.test(password)) throw { message: 'Password must contains number' }

            await users.update(
                { status: 'Verified', password: await hashPassword(password) },
                {
                    where: {
                        id
                    }
                }, { transaction: t }
            )

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Account Verified!',
                data: null
            })
        } catch (error) {
            await t.rollback()
            // console.log(error)
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getStatusUser: async (req, res) => {
        try {
            let getToken = req.dataToken
            // console.log(id)

            let data = await db.user.findOne({
                where: {
                    id:getToken.id
                }
            })

            res.status(201).send({
                isError: false,
                message: 'get Status Success',
                data,
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    userLogin: async (req, res) => {
        try {
            let { email, password } = req.body
            // console.log(email)
            // console.log(password)

            if (!password) throw { message: 'Please fill all data!' }

            let dataUser = await db.user.findOne({
                where: {
                    email
                }
            })
            // console.log(dataUser.dataValues)
            if (!dataUser) throw { message: 'Account not found!' }

            let matchPassword = await hashMatch(password, dataUser.dataValues.password)

            if (matchPassword === false) return res.status(404).send({
                isError: true,
                message: 'Wrong password',
                data: null
            })

            const token = createToken({ id: dataUser.dataValues.id })

            res.status(201).send({
                isError: false,
                message: 'Login Success',
                data: {
                    'username': `${dataUser.dataValues.name}`,
                    'token': token,
                    'role': null,
                    'id': dataUser.dataValues.id
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
    confirmEmail: async (req, res) => {
        try {
            let { email } = req.body
            // console.log(email)

            let data = await db.user.findOne({
                where: {
                    email
                }
            })

            if (!data) throw { message: 'Email not found' }

            const template = await fs.readFile(path.resolve(__dirname, '../template/resetpassword.html'), 'utf-8')
            const templateToCompile = await handlebars.compile(template)
            const newTemplate = templateToCompile({ name: data.name, email, url: `https://jcwd230201.purwadhikabootcamp.com/reset-password/${data.id}` })
            await transporter.sendMail({
                from: 'iFrit',
                to: email,
                subject: 'Reset Password',
                html: newTemplate
            })

            res.status(201).send({
                isError: false,
                message: 'Get Email Success!',
                data,
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    resetPassword: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let { id } = req.params
            let { password } = req.body

            if (password.length < 8) throw { message: 'Password at least has 8 characters' }

            let character = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
            if (!character.test(password)) throw { message: 'Password must contains number' }

            await users.update(
                { password: await hashPassword(password) },
                {
                    where: {
                        id
                    }
                }, { transaction: t }
            )

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Reset Password Success',
                data: null
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    keep_login: async (req, res) => {
        try {
            let getToken = req.dataToken
            // console.log(getToken)

            let tokenUser = await db.user.findOne({
                where: {
                    id: getToken.id
                }
            })
            // console.log(tokenUser)

            res.status(201).send({
                isError: false,
                message: 'Token still valid',
                data: tokenUser
            })

        } catch (error) {
            // console.log(error)
            res.status(401).send({
                isError: true,
                message: error.message,
                data: null
            })

        }
    },
    updatePhotoProfile: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let getToken = req.dataToken
            console.log(req.files)

            let profilePicture = await users.update({ photo_profile: `Public/images/${req.files.images[0].filename}` }, {
                where: {
                    id: getToken.id
                }
            }, { transaction: t })

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Update Photo Profile Success!',
                data: profilePicture
            })

        } catch (error) {
            await t.rollback()
            deleteFiles(req.files)
            // console.log(error)
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    updateDataProfile: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let getToken = req.dataToken

            let { name, phone_number, oldpassword, newpassword } = req.body

            let getData = await db.user.findOne({
                where: {
                    id: getToken.id
                }
            })

            let matchPassword = await hashMatch(oldpassword, getData.password)



            if (phone_number.length > 13) throw { message: 'Please input valid phone number' }

            if (name && phone_number && !oldpassword && !newpassword) {
                await users.update({
                    name, phone_number
                }, {
                    where: {
                        id: getToken.id
                    }
                }, { transaction: t })
            } else if (name && phone_number && oldpassword && newpassword) {

                if (!oldpassword && newpassword) throw { message: 'Please input your current password' }

                if (newpassword.length < 8) throw { message: 'Password at least has 8 characters' }

                if (matchPassword === false) return res.status(404).send({
                    isError: true,
                    message: 'Your current password wrong!',
                    data: null
                })


                let character = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
                if (!character.test(newpassword)) throw { message: 'Password must contains number' }

                await users.update({
                    name, phone_number, password: await hashPassword(newpassword)
                }, {
                    where: {
                        id: getToken.id
                    }
                }, { transaction: t })
            }

            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Update Data Profile Success!',
                data: null
            })
        } catch (error) {
            await t.rollback()
            // console.log(error)
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    addAddressUser: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let { user_id, receiver_name, user_address, phone_number, subdistrict, province_id, province, city_id, city } = req.body


            let checkData = await db.user_address.findOne({
                where: {
                    user_id: user_id.id
                }
            })


            let jalan = `${user_address}%20${subdistrict}%20${city}%20${province}`
            // console.log(jalan)

            let response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${jalan}&key=f3582c716b9f443a9d260569d39b1ac3`)
            // console.log(response.data.results[0].geometry.lat)

            if (!checkData) {
                await db.user_address.create({
                    user_id: user_id.id, receiver_name, user_address, value: 1, phone_number, subdistrict, province_id, province, city_id, city, latitude: response.data.results[0].geometry.lat, longitude: response.data.results[0].geometry.lng
                }, { transaction: t })
            } else {
                await db.user_address.create({
                    user_id: user_id.id, receiver_name, user_address, value: 0, phone_number, subdistrict, province_id, province, city_id, city, latitude: response.data.results[0].geometry.lat, longitude: response.data.results[0].geometry.lng
                }, { transaction: t })
            }


            await t.commit()
            res.status(201).send({
                isError: false,
                message: 'Add Address Success!',
                data: null
            })

        } catch (error) {
            // console.log(error)
            await t.rollback()
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    updateAddressUser: async (req, res) => {
        try {
            let { id, receiver_name, user_address, phone_number, subdistrict, province_id, province, city_id, city } = req.body
            // console.log(province)

            // let checkData = await db.user_address.findOne({
            //     where: {
            //         id
            //     }
            // })

            await db.user_address.update({
                receiver_name, user_address, phone_number, subdistrict, province_id, province, city_id, city
            }, {
                where: {
                    id
                }
            })

            res.status(201).send({
                isError: false,
                message: 'Update Address Success!',
                data: null
            })
        } catch (error) {
            // console.log(error)
            res.status(404).send({
                isError: true,
                message: error,
                data: null
            })
        }
    },
    deleteAddressUser: async (req, res) => {
        try {
            let { id } = req.body

            let deleteAddress = await db.user_address.destroy({
                where: {
                    id
                }
            })

            res.status(201).send({
                isError: false,
                message: 'Delete Address Success!',
                data: null
            })
        } catch (error) {
            // console.log(error)
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    changeDefaultAddress: async (req, res) => {
        try {
            let { id, user_id } = req.body

            let data = await db.user_address.findAll({
                where: {
                    user_id
                }
            })

            // console.log(data)

            for (let i = 0; i < data.length; i++) {
                if (data[i].dataValues.value == 1) {
                    await db.user_address.update({
                        value: 0
                    }, {
                        where: {
                            user_id
                        }
                    })
                }
            }



            let dataToChange = await db.user_address.findOne({
                where: {
                    id
                }
            })

            if (dataToChange.dataValues.value == 0) {
                await db.user_address.update({
                    value: 1
                }, {
                    where: {
                        id
                    }
                })
            }

            res.status(201).send({
                isError: false,
                message: 'Change Main Address Success',
                data: null
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error,
                data: null
            })
        }
    }
}
