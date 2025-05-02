const profileModel = require("../models/profile.model");
const userModel = require("../models/user.model");

module.exports.createProfileView = async(req, res) => {
const data = req.user.id;
const user=await userModel.findOne({_id:data});
  res.render("userProfile",{user});
};

module.exports.createProfileUser = async (req, res) => {
  const { media, caption } = req.body;

  const profile = await profileModel.create({
    media,
    caption,
  });

  await userModel.findOneAndUpdate(
    {
      _id: req.user.id,
    },
    {
      $push: {
        profile: profile._id,
      },
    }
  );
  res.send(profile);
};



// Show all users on userProfile controller

// module.exports.allUsersController = async (req, res) => {
//   try {
//     const users = await userModel.find();
//     console.log(users);
//     res.render("userProfile", { users:users }); // pass `users` array to EJS
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to fetch users");
//   }
// };
