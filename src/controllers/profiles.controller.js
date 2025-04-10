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
