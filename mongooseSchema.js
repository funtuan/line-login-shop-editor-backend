const mongoose = require('mongoose');
require('dotenv').config();

const ShopModel = mongoose.model('Shop', {
  name: String,
  address: String,
  phone: String,
  leader: String,
  note: String,
  tag: String,
  changeRecord: Array,
});

const MemberModel = mongoose.model('Member', {
  sub: String,
  aud: String,
  name: String,
  picture: String,
});

const TagModel = mongoose.model('Tag', {
  name: String,
  changeRecord: Array,
});

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  MemberModel,
  TagModel,
  ShopModel,
};