const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Received: ", { name, email, password, role });

    const emailExist = await User.findOne({
      where: { email: email },
      attributes: ["email"],
    });
    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: "Email already exist",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      });
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }
  } catch (error) {
    console.log("Registration error: ", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

const login = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({
    where: { email: email },
  });
  if (!existingUser) {
    return res.status(401).json({
      success: false,
      message: "User doesn't exist",
    });
  } else {
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password",
      });
    } else {
      const payload = {
        userId: existingUser.id,
        role: existingUser.role,
      };
      const secretKey = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      res.status(200).json({
        success: true,
        message: "Login successfully",
        token: token,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
    }
  }
};

module.exports = { register, login };
