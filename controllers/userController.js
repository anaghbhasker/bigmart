const userLogin = require("../model/userSchema");
const bcrypt = require("bcrypt");

module.exports.homepage = (req, res) => {
  res.locals.user = req.session.user;
  res.render("user/home");
};
module.exports.signuppage = (req, res) => {
  res.render("user/usersignup");
};
module.exports.loginpage = (req, res) => {
  res.render("user/userlogin");
};

module.exports.userpostsignup = async (req, res) => {
  try {
    const userData = req.body;
    let email = await userLogin.findOne({ email: userData.email });
    if (!email) {
      userData.password = await bcrypt.hash(userData.password, 10);
      await userLogin.create(userData);
      req.session.userLogged = true;
      res.redirect("/userlogin");
    } else {
      res.render("user/usersignup", { message: "Your email already defined" });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports.userpostLogin = async (req, res) => {
  try {
    const userLogindetails = req.body;
    let userEmail = await userLogin.findOne({ email: userLogindetails.email });
    if (userEmail) {
      const userResult = await bcrypt.compare(userLogindetails.password,userEmail.password);
      if (userResult) {
        if (!userEmail.isBanned) {
          req.session.userLogged = true;
          req.session.user = userEmail;
          res.redirect("/");
        } else {
          res.render("user/userlogin", { message: "Your account is blocked" });
        }
      } else {
        res.render("user/userlogin", { message: "Incorrect password" });
      }
    } else {
      res.render("user/userlogin", { message: "Your email is invalid" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.userLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
