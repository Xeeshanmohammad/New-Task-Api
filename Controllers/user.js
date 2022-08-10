const express = require("express");
const router = new express.Router();
const User = require("../Models/user");
const auth = require("../middleware/full-auth");


router.post("/createUser", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateTokenAuth();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// router.post("/loginUser", async (req, res) => {

//         const { email, password } = req.body;

//         if (!email || !password ) {
//           res.status(400).json({
//             success: false,
//             message:"Please Enter Email & Password",
//           })
//         }
//       try {
//       const user = await User.findOne({ "email":req.body.email});
//       const token = jwt.sign({_id:'abcd1235'},'this is my new course')
//         if (user) {
//           const isPasswordMatched = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatched) {
//           res.status(401).json({
//             success: false,
//             message:"Invalid password",
//           })
//         }
//         res.status(200).json({
//           success: true,
//           message:"logged in succesfully",
//           token
//         })}

//       } catch (error) {
//         console.log(error);
//       }
//     })

router.get("/getAllUser",auth,  async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getUser/:id ", auth, async (req, res) => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      res.status(401).send("Error");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/login/User",  async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.findByCredentials(email,password);
    const token = await user.generateTokenAuth();
    res.send({
      success: true,
      message:"logged in succesfully",
      token,
      user
    })
  } catch (e) {
    res.status(401).send("....."+e);
  }
});

router.post("/logoutUser", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != -req.token;
    });
    await req.user.save();
    res.status(200).send("Logged Out");
  } catch (error) {
    res.status(500).send("error");
  }
});


router.patch("/userUpdate/:id", async (req, res) => {
  const update = Object.keys(req.body);
  const updateAllowed = ["name", "email", "password", "age"];
  const isValidOperations = update.every((updates) =>
    updateAllowed.includes(updates)
  );
  if (!isValidOperations) {
    return res.status(401).send("error: Invalid Update");
  }
  try {
    const user = await User.findById(req.params.id);
    update.forEach((updates) => (user[updates] = req.body[updates]));
    await user.save();
    if (!user) {
      res.status(401).send("No User");
    }
  } catch (error) {
    console.log("error" + error);
  }
});

router.delete("/deleteUser/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.sendStatus(404).send("Not match to any userId");
    }
    res.status(200).send("Deleted Successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
