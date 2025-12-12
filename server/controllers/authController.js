const bcrypt = require("bcrypt");
const { User } = require("../models");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Received: ", { name, email, password, role });

    const emailExist = await User.findOne({ where: { email: email } });
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

module.exports = { register };
