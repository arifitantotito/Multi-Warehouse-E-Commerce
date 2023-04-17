//import sequelize 
const {sequelize} = require('./../models')
const { Op } = require('sequelize')
const {v4:uuidv4} = require('uuid');
const { QueryTypes } = require('sequelize');

const db = require('./../models/index');
const axios = require('axios')

module.exports= {
    getProvince: async(req, res)=>{
        try {
            let {key} = req.headers
            let data = await axios.get('https://api.rajaongkir.com/starter/province',{
                headers:{
                    "key": key
                }
            })
            // console.log(data)
            res.status(200).send({
                isError: false, 
                message: 'Get Province Success',
                data: data.data.rajaongkir.results
                
            })
        } catch (error) {
            // console.log(error)
            res.status(400).send({
                isError: true, 
                message: error.message,
                data: null
            })
        }
    },
    getCity: async(req, res)=>{
        try {
            let {province_id} = req.query
            // console.log(province_id)
            let {key} = req.headers

            // if(!province_id) return res.status(404).send({
            //     isError: true, 
            //     message: 'Province_Id Not Found!',
            //     data: null
            // })

            let data = await axios.get(`https://api.rajaongkir.com/starter/city?province=${province_id}`,{
                headers:{
                    "key": key
                },
            })
            // console.log(data);

            res.status(200).send({
                isError: false, 
                message: 'Get City Success!',
                data: data.data.rajaongkir
            })
        } catch (error) {
            // console.log(error)
            res.status(500).send({
                isError: true, 
                message: error.message,
                data: null
            })
        }
    },
    postOngkir: async(req,res)=>{
        try {
            let {origin, destination, weight, courier} = req.body
            let {key} = req.headers
            let data = await axios.post(`https://api.rajaongkir.com/starter/cost`,{origin, destination, weight, courier},{
                headers:{
                    "key": key
                },
            })
            res.status(200).send({
                isError: false, 
                message: 'Get Success!',
                data: data.data.rajaongkir
            })
        } catch (error) {
            // console.log(error.message);
            res.status(400).send({
                isError: true, 
                message: error.message,
                data: null
            })
        }
    }
}