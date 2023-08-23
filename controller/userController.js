const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const  jwt  = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// description get all contacts
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Input fields are mandatory");
  }
  const userAvalable = await User.findOne({ email });
  if (userAvalable) {
    res.status(400);
    throw new Error("User is already registered");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    res
      .status(201)
      .json({
        msg: "User created succesfully",
        _id: user.id,
        email: user.email,
      });
  } else {
    res.status(400);
    throw new Error("Invalid request");
  }

  res.json({ msg: "User created succefully" });
});

// description get all contacts
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  // compare password with hashedPassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESSS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("invalid email or password ");
  }
});

// description get all contacts
// @route GET /api/users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
  res.json( req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
