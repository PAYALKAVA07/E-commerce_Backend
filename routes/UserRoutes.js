const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/UserController');
const AuthenticationMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//getAll
router.get('/', AuthenticationMiddleware.authenticate, AuthenticationMiddleware.authorize("admin", "getAllUsers"), getAllUsers);
//getById
router.get('/:id', AuthenticationMiddleware.authenticate, AuthenticationMiddleware.authorize("admin", "getUserById"), getUserById);
//UpdateUser
router.patch('/:id', AuthenticationMiddleware.authenticate, updateUser);
//DeleteUser if role is admin
router.delete('/:id', AuthenticationMiddleware.authenticate, AuthenticationMiddleware.authorize("admin", "deleteUser"), deleteUser);

module.exports = router;

// //getall
// router.get('/', async (req, res) => {
//   const data = await User.find();
//   res.send(data);
// });

// //getById
// router.get('/:id', async (req, res) => {
//   try {
//     const data = await User.findById(req.params.id);
//     if (!data) {
//       return res.send({ message: "User not found" });
//     }
//     res.send(data);
//   }
//   catch (error) {
//     res.send(error);
//   }
// });

// //signUpAPI
// router.post("/signup", async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ user_email: req.body.user_email });
//     if (existingUser) {
//       return res.send({ message: "This Email already exists..!" });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
//     const data = await User.create({ ...req.body, user_password: hashedPassword });

//     res.send({ message: "New User Created..!", user: data });
//   } catch (error) {
//     res.send(error);
//   }
// });

// //updateUser
// router.patch('/:id', async (req, res) => {
//   try {
//     const data = await User.findByIdAndUpdate(req.params.id, req.body);
//     if (!data) {
//       return res.send({ message: "User not found" });
//     }
//     res.send(data);
//   }
//   catch (error) {
//     res.send(error);
//   }
// });

// //DeleteUser
// router.delete('/:id', async (req, res) => {
//   try {
//     const data = await User.findByIdAndDelete(req.params.id)
//     if (!data) {
//       return res.send({ message: "User not found" });
//     }
//     res.send(data);
//   }
//   catch (error) {
//     res.send(error);
//   }
// });

// //loginAPI
// router.post("/login", async (req, res) => {
//   try {
//     const { user_email, user_password } = req.body;

//     const user = await User.findOne({ user_email });
//     if (!user) {
//       return res.send({ isValid: false, message: "Invalid Username or Password..!" });
//     }

//     const isMatch = await bcrypt.compare(user_password, user.user_password);
//     if (!isMatch) {
//       return res.send({ isValid: false, message: "Invalid Username or Password..!" });
//     }

//     const token = jwt.sign({ userID: user._id, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.send({ isValid: true, message: "Welcome", token });
//   } catch (error) {
//     res.send(error);
//   }
// });