const User = require('../../db/models');

// GET
exports.findAll = async(req, res) {
  try {
    await User.find({});
    res.status(200).json({
      success: true,
      message: 'Found all users!'
    });
  } catch(err) {
    console.err(`Error fetching users: ${ err }`);
  }
};

// POST
exports.register = async(req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if username or email already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists!' });
    }

    // otherwise create user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });

  } catch(err) {
    res.status(500).json({ error: 'Something went wrong...' });
  }
};