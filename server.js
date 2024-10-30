const express = require('express') 
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const app = express()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const taste = require('./Controller/TasteController')
const milk = require('./Controller/MilkController')
const size = require('./Controller/SizeController')
const menu = require('./Controller/MenuController')
const table = require('./Controller/TableController')
const orderItem = require('./Controller/orderItemControllder')


app.use('/uploads', express.static('uploads'))
app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload())

app.post('/api/user/signIn', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await prisma.admin.findFirst({
        where: {
          username: username,
          status: 'use'  
        }
      });
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if (isPasswordValid) {
          const token = jwt.sign({ id: user.id, name: user.name }, 'your_secret_key', { expiresIn: '1h' });
          return res.json({ token, name: user.name, id: user.id });
        } else {
          return res.status(401).json({ message: 'Invalid password' });
        }
      } else {
        return res.status(401).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
app.get('/api/temperature/list', async (req, res) => {
    try{
    const rows = await prisma.temperature.findMany({
        where: {
            status: "use"
        },
        orderBy: {
            id: "desc"
        }
    })
    return res.send({ results: rows })
  }catch(error){
    return res.status(500).send({ error : error.message})
  }
})

// ----- taste ----- //
app.get("/api/taste/list", (req,res) => {
    taste.list(req,res)
})
app.post("/api/taste/create", (req,res) => {
    taste.create(req,res)
})
app.put("/api/taste/update", (req,res) => {
    taste.update(req,res)
})
app.delete("/api/taste/remove/:id", (req,res) => {
    taste.remove(req,res)
})

// ----- milk ----- //
app.get("/api/milk/list", (req,res) => {
  milk.list(req,res)
})
app.post("/api/milk/create", (req,res) => {
    milk.create(req,res)
})
app.delete("/api/milk/remove/:id", (req,res) => {
    milk.remove(req,res)
})
app.put("/api/milk/update", (req,res) => {
    milk.update(req,res)
})


// ----- size ----- //
app.get("/api/size/list", (req,res) => {
    size.list(req,res)
})
app.post("/api/size/create", (req,res) => {
    size.create(req,res)
})
app.delete("/api/size/remove/:id", (req,res) => {
    size.remove(req,res)
})  
app.put("/api/size/update", (req,res) => {
    size.update(req,res)
})

// ----- menu ----- //
app.post('/api/menu/upload', (req, res) => {
    menu.upload(req, res)
})
app.get('/api/menu/list', (req, res) => {
    menu.list(req, res)
})
app.post('/api/menu/create', (req, res) => {
    menu.create(req, res)
})
app.delete('/api/menu/remove/:id', (req, res) => {
    menu.remove(req, res)
})
app.put('/api/menu/update', (req, res) => {
    menu.update(req, res)
})

// ----- table ----- //
app.post('/api/table/create', (req, res) => {
  table.create(req, res)
})
app.get('/api/table/list', (req, res) => {
  table.list(req, res)
})
app.delete('/api/table/remove/:id', (req, res) => {
  table.remove(req, res)
})
app.get('/api/table/verify', (req, res) => {
  table.verify(req, res); 
})

// ----- order ----- //
app.post('/api/orderitem/create', (req, res) => {
  orderItem.create(req, res)
})
app.get('/api/orderitem/list', (req, res) => {
  orderItem.list(req, res)
})
app.delete('/api/orderitem/remove/:id', (req, res) => {
  orderItem.remove(req, res)
})
app.post('/api/orderitem/createMystery', (req, res) => {
  orderItem.createMysteryItem(req, res)
})
app.put('/api/orderitem/update', (req, res) => {
  orderItem.update(req, res)
})
app.post('/api/order/create', (req, res) => {
  orderItem.createOrder(req, res)
})
app.get('/api/order/list', (req, res) => {
  orderItem.listOrder(req, res)
})
app.delete('/api/order/remove/:id', (req, res) => {
  orderItem.removeOrder(req, res)
})
app.put('/api/order/submit/:id', (req, res) => {
  orderItem.submit(req, res)
})
app.get('/api/order/getRevenue', (req, res) => {
  orderItem.getTotalRevenue(req, res)
})
app.get('/api/order/listbydate', (req, res) => {
  orderItem.listByDate(req, res)
})



app.listen(3001, () => {
    console.log('Server started on port 3001')
})