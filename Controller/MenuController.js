const {PrismaClient} = require('@prisma/client')
const path = require('path')

const prisma = new PrismaClient()

module.exports = {
    upload: async (req, res) => {
        try {
            if (req.files != undefined) {
                const myFile = req.files.myFile;

                const fileName = myFile.name;

                const fileExtension = fileName.split('.').pop();
                const newFileName = new Date().getTime() + '.' + fileExtension;
                const path = 'uploads/' + newFileName;

                myFile.mv(path, async (err) => {
                    if (err) {
                        return res.status(500).send({ error: err.message });
                    }

                    return res.send({ message: 'success', fileName: newFileName });
                });
            } else {
                return res.status(500).send({ error: 'No file uploaded' });
            }
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },

    create: async (req,res) => {
        try {
            const price = parseFloat(req.body.price)

            await prisma.menu.create({
                data:{
                    name: req.body.name,
                    price:price,
                    comment:req.body.comment,
                    status:"use",
                    img: req.body.img,
                    sizes:{
                        connect: req.body.sizes?.map((sizeId)=>({id : sizeId})) || []
                    },
                    milkTypes:{
                        connect: req.body.milkTypes?.map((milkTypeId) => ({id : milkTypeId})) || []
                    },
                    tastes:{
                        connect: req.body.tastes?.map((tasteId) => ({id : tasteId})) || []
                    },
                    temperatures:{
                        connect: req.body.temperatures?.map((temperatureId) => ({id : temperatureId})) || []
                    }
                }
            })

            return res.send({message: "success"})
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    },

    list: async (req,res) => {
        try {
            const rows = await prisma.menu.findMany({
                include: {
                    sizes: true,
                    milkTypes: true,
                    temperatures: true,
                    tastes: true
                },
                where:{
                    status: "use"
                },
                orderBy:{
                    id: "desc"
                }
            })
            return res.send({ results: rows })
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    },

    remove: async (req, res) => {
        try {
            await prisma.menu.update({
                data: {
                    status: "delete"
                },
                where:{
                    id: parseInt(req.params.id)
                }
            })

            return res.send({message: "success"})
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    },

    update: async (req, res) => {
        try {
            const menuId = req.body.id;
            const price = parseFloat(req.body.price);

            await prisma.menu.update({
                where: {
                    id: menuId
                },
                data: {
                    name: req.body.name,
                    price: price,
                    comment: req.body.comment,
                    img: req.body.img,
                    sizes: {
                        set: req.body.sizes?.map((sizeId) => ({ id: sizeId })) || []
                    },
                    milkTypes: {
                        set: req.body.milkTypes?.map((milkTypeId) => ({ id: milkTypeId })) || []
                    },
                    temperatures: {
                        set: req.body.temperatures?.map((temperatureId) => ({ id: temperatureId })) || []
                    },
                    tastes: {
                        set: req.body.tastes?.map((tasteId) => ({ id: tasteId })) || []
                    }
                }
            });

            return res.send({ message: "success" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
}