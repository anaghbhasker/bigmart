const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const express = require("express");
const createError = require("http-errors");
const userRouter = require("../routes/userRouter");
const adminRouter = require("../routes/adminRouter");
const logger = require("morgan");
const connectDb = require("../model/dbconnection");
const cookieParser = require("cookie-parser");
const DATABASE_URL = process.env.DATABASE_URL;
const session = require("express-session");

const app = express();
// Clear Cache

const oneHour = 1000 * 60 * 60;
app.use(
  session({
    secret: "bigmart",
    cookie: { maxAge: oneHour },
  })
);

connectDb(DATABASE_URL);

// app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/", userRouter);


app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

// app.use(function (req, res, next) {
//   next(createError(404));
// });




module.exports = app;

//error handler

//  app.use(function (err, req, res, next) {
//      // set locals, only providing error in development
//      res.locals.message = err.message;
//      res.locals.error = req.app.get('env') === 'development' ? err : {};
   
//      // render the error page
//      res.status(err.status || 500);
//      res.render('error/404');
//    });





