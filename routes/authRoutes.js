// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const fs = require("fs").promises;
const router = express.Router();

// Custom middleware to check if the user is authorized
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login", { message: "wrong credentials" });
  }
  //res.redirect('/login',); // Redirect to login page if not authenticated
}

function ensureAuthorized(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "User") {
    // User is authenticated and has the role of 'User'
    return next();
  } else if (req.isAuthenticated() && req.user.role === "Admin") {
    return next();
    // User is not authenticated or does not have the role of 'User'
  } else {
    res.redirect("/login");
  }
}

//email sender
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "ricococo788@gmail.com",
    pass: "aliipsydxipwwigo",
  },
});

router.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

router.get("/register", (req, res) => {
  res.render("register");
});
// user Registration route
router.post("/register", async (req, res) => {
  const username = req.body.email;
  const fName = req.body.fName;
  const lName = req.body.lName;
  const contact = req.body.contact;
  const email = username;
  const digitalAddress = req.body.digitalAddress;

  const ID = req.body.ID;
  const password = req.body.password;
  const Address = req.body.Address;
  const role = "User";
  try {
    const find = await User.findOne({ username });
    if (find) {
      console.log("user already registered");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        fName,
        lName,
        contact,
        email,
        digitalAddress,
        password: hashedPassword,
        role,
        ID,
        Address,
      });
      // res.status(201).json({ message: 'Registration successful.' });
      res.redirect("/login", { message: "user Account created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
  // If authentication is successful, this callback will be called.
  if (req.user.role === "User") res.redirect("/userdashboard");
  else if (req.user.role === "Admin") {
    res.redirect("/adminDashboard");
  }
});

//user Dashboard
router.get("/userdashboard", ensureAuthenticated, (req, res) => {
  // If authentication is successful, this callback will be called.
  res.render("Userdashboard");
});

//user booking is pending
router.get("/bookPending", ensureAuthorized, (req, res) => {
  // If user reaches here, they are authorized to access the route
  res.render("bookPending", { user: req.user });
});
 
// user booking a visit
router.get("/bookvisit", ensureAuthorized, async (req, res) => {
  try {
    // If user reaches here, they are authorized to access the route
    const findUser = await User.findOne({ username: req.user.username });
 
    if (findUser) {
      const pendingBooking = findUser.booking.some(
        (booking) => booking.status === "Pending"
      );

      if (pendingBooking) {
        res.redirect("/bookPending");
      } else {
        res.render("bookvisit", { user: req.user });
      }
    } else {
      // Handle case where user is not found
      res.status(404).send("User not found");
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/bookvisit", async (req, res) => {
  // If user reaches here, they are authorized to access the route
  try {
    if (true) {
      console.log(req.body);
      console.log(req.user);
      const finduser = await User.findOne({ username: req.user.username });
      if (finduser) {
        await User.updateOne(
          { username: req.user.username },
          {
            $push: {
              booking: {
                fNameInmate: req.body.fNameInmate,
                lNameInmate: req.body.lNameInmate,
                sentanceyear: req.body.sentanceyear,
                crime: req.body.crime,
                items: req.body.items,
                additionalInfo: req.body.additionalInfo,
                bookDate: req.body.bookDate,
                appointmentDate: req.body.appointmentDate,
                status: req.body.status,
              },
            },
          }
        );
        res.redirect("/bookPending");
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect("/bookvisit");
  }
});

// user booking history
router.get("/bookhistory", ensureAuthorized, (req, res) => {
  // If user reaches here, they are authorized to access the route
  res.render("bookhistory", { user: req.user });
});

// user calender route

router.get("/calender", ensureAuthorized, (req, res) => {
  res.render("calender", { user: req.user });
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
  // res.json({ message: 'Logged out successfully.' });
});

// /////////////////////////////////////////////////////////////////////////////////////////

router.get("/adminRegister", (req, res) => {
  res.render("adminRegister");
});

// admin Register
router.post("/adminRegister", async (req, res) => {
  const username = req.body.email;
  const fName = req.body.fName;
  const lName = req.body.lName;
  const contact = req.body.contact;
  const email = username;
  const digitalAddress = req.body.digitalAddress;
  const role = req.body.role;
  const password = req.body.password;

  try {
    const find = await User.findOne({ username });
    if (find) {
      console.log("user already registered");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        fName,
        lName,
        contact,
        email,
        digitalAddress,
        password: hashedPassword,
        role,
        ID,
        Address,
      });
      // res.status(201).json({ message: 'Registration successful.' });
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// admin admin Dashboard
router.get("/adminDashboard", ensureAuthorized, (req, res) => {
  // If user reaches here, they are authorized to access the route
  res.render("adminDashboard", { user: req.user });
});

// admin approve visit
router.get("/approvevisit", ensureAuthorized, async (req, res) => {
  try {
    const findPendingBookings = await User.find({
      "booking.status": "Pending",
    });
    // console.log(findPendingBookings);
    res.render("approvevisit", {
      user: req.user,
      pendingBookings: findPendingBookings,
    });
  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response
    res.status(500).send("Internal Server Error");
  }
});

// approve admin visit to send email
router.post("/approvalStatus", async (req, res) => {
  const findbooking = req.body.bookingID;
  const action = req.body.action;
  //console.log(findbooking, action)
  try {
    if (action === "approve") {
      const finderApprovedUser = await User.findOne({
        "booking._id": findbooking,
      });
      const booking = finderApprovedUser.booking.find(
        (booking) => booking._id.toString() === findbooking
      );

      // Generate QR code containing only the booking ID
      const qrData = booking._id.toString();
      const qrImagePath = `${__dirname}/qr_codes/${findbooking}.png`;
      await qr.toFile(qrImagePath, qrData);

      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <webdryk96@gmail.com>', // sender address
        to: finderApprovedUser.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
        attachments: [
          {
            filename: "qr_code.png",
            path: qrImagePath,
            cid: "qr_code@unique_cid", // Use a unique CID
          },
        ],
      });

      await User.updateOne(
        { "booking._id": findbooking },
        { $set: { "booking.$.status": "Approved" } }
      );
      await fs.unlink(qrImagePath);
    } else if (action === "reject") {
      await User.updateOne(
        { "booking._id": findbooking },
        { $set: { "booking.$.status": "Rejected" } }
      );
    }
    res.redirect("/approvevisit");
  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response
    res.status(500).send("Internal Server Error not able to update booking");
  }
});
// QR code scanning route
router.get("/scan", ensureAuthorized, (req, res) => {
  // If user reaches here, they are authorized to access the route

  res.render("qr", { user: req.user });
});

router.post("/scan", async (req, res) => {
  const bookingID = req.body.QRCode;

  // Fetch corresponding booking details from the database using bookingID
  const bookingDetails = await User.findOne({
    "booking._id": bookingID,
  }).select("booking.$");
  const finduserWithBooking = await User.findOne({ "booking._id": bookingID });
  //console.log(bookingDetails);

  res.render("bookdetails", { bookingDetails, finduserWithBooking });
});

// admin calender route
router.get("/admincalender", ensureAuthorized, async (req, res) => {
  try {
    // Query all users' bookings
    const allBookings = await User.aggregate([
      {
        $unwind: "$booking", // Flatten the booking array
      },
      {
        $sort: { "booking.appointmentDate": 1 }, // Sort by appointmentDate in ascending order
      },
    ]);

    res.render("admincalender", { user: req.user, bookings: allBookings });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// get visit history route
router.get("/visithistory", ensureAuthorized, async (req, res) => {
  try {
    const approvedAndRejectedBookings = await User.find({
      "booking.status": { $in: ["Approved", "Rejected"] },
    }).sort({ "booking.appointmentDate": -1 }); // Sort in descending order

    // Group the bookings by appointment date
    const groupedBookings = {};
    approvedAndRejectedBookings.forEach((booking) => {
      const appointmentDate = booking.booking[0].appointmentDate;
      if (!groupedBookings[appointmentDate]) {
        groupedBookings[appointmentDate] = [];
      }
      groupedBookings[appointmentDate].push(booking);
    });

    res.render("visithistory", {
      user: req.user,
      groupedBookings: groupedBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// admin profile route
router.get("/adminProfile", ensureAuthenticated, (req, res) => {
  res.render("adminProfile", { user: req.user });
});

//user profile route
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

// logout route
router.get("/logout", (req, res) => {
  res.redirect("/login");
});

module.exports = router;
