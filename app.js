require('dotenv').config()
const express = require('express');
const http = require("http");
const { Server } = require("socket.io");

const ejs = require('ejs')
const path = require('path')
const dbConnection = require('./app/config/dbcon')
const cors = require('cors')

const app = express();
const server = http.createServer(app);
const io = new Server(server);


dbConnection()

app.set("io", io);
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
const session = require('express-session');
const flash = require('connect-flash');

app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use((req, res, next) => {
    res.locals.admin = req.session?.admin || null;
    next();
});
//corse middleware
app.use(cors())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});


const authRoutes = require('./app/routes/authRoutes')
app.use('/', authRoutes)

const courseRoutes = require('./app/routes/courseRoutes')
app.use('/api', courseRoutes)

const dashboardRoutes = require('./app/routes/dashboardRoutes')
app.use('/api', dashboardRoutes)

const studentRoutes = require('./app/routes/studentRoutes')
app.use('/api', studentRoutes)

const ejsRoutes = require('./app/routes/EjsRoutes');
app.use('/', ejsRoutes);

const userStudentRoutes = require('./app/routes/userStudentRoutes');
app.use('/', userStudentRoutes);


io.on("connection", (socket) => {

    console.log("Connected socket :", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected");
    });

});

const Port = process.env.PORT || 3007;

server.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});





