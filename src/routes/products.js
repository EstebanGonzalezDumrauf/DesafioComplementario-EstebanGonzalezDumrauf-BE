import {
    Router
} from 'express';
import {
    productModel
} from '../dao/models/product.js';
import mongoose from 'mongoose';

const router = Router();

router.get('/limited', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.query.limit);
        const cantLimit = parseInt(req.query.limit); // Obtén el valor del parámetro "limit" como número

        if (isNaN(cantLimit) || cantLimit <= 0) {
            return res.status(400).json({
                result: 'error',
                message: 'El parámetro "limit" no es un número válido o es menor o igual a cero'
            });
        }

        const productos = await productModel.find().limit(cantLimit);

        res.status(200).json({
            result: 'success',
            payload: productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor'
        });
    }
});

router.get('/all', async (req, res) => {
    try {
        let productos = await productModel.find();
        res.send({
            result: 'sucess',
            payload: productos
        });

    } catch (error) {
        console.log(error);
    }

})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        console.log('Datos recibidos:', pid);
        const producto = await productModel.findById(pid);

        if (!producto) {
            return res.status(404).json({
                result: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            result: 'success',
            payload: producto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor'
        });
    }
});




router.post('/', async (req, res) => {

    try {
        let {
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock
        } = req.body;

        if (!title || !code) {
            return res.send({
                status: "Error",
                error: 'Datos incompletos'
            });
        }

        let result = await productModel.create({
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock
        });

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }

})

router.put('/:pid', async (req, res) => {

    let datosAUpdate = req.body;
    let {
        pid
    } = req.params;

    // if (!datosAUpdate.title || !datosAUpdate.code) {
    //     return res.send({
    //         status: "Error",
    //         error: 'Datos incompletos'
    //     });
    // }

    let result = await productModel.updateOne({
        _id: pid
    }, datosAUpdate);

    res.send({
        result: 'sucess',
        payload: result
    });
})

router.delete('/:pid', async (req, res) => {

    let {
        pid
    } = req.params;

    let result = await productModel.deleteOne({
        _id: pid
    });

    res.send({
        result: 'sucess',
        payload: result
    });
})

export default router;