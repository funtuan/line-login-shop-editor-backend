const User = require('./User.js');
const { ShopModel, TagModel } = require('./mongooseSchema.js');

function errorHandler(req, res, msg) {
  res.status(400).send({
    success: false,
    msg,
  });
  return;
}

function loadUserHandler(req, res, next) {
  const userToken = req.session.id_token;
  const id = req.params.id;
  if (!userToken) return errorHandler(req, res, '尚未登入');
  req.user = new User();
  req.user.login(userToken).then(() => {
    next();
  });
}

class RestAPIHandler {
  constructor(Model) {
    this.Model = Model;
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this);
  }

  post(req, res) {
    console.log(this.Model);
    req.user.updateModel(req.body, this.Model).then((one) => {
      res.send(one);
    });
    return;
  }

  put(req, res) {
    req.user.updateModel(req.body, this.Model).then((one) => {
      res.send(one);
    }).catch((err) => {
      errorHandler(req, res, err.message);
    });
    return;
  }

  get(req, res) {
    req.user.getModel(req.params.id, this.Model).then((list) => {
      res.send(list);
    });
    return;
  }

  delete(req, res) {
    req.user.removeModel(req.params.id, this.Model).then((one) => {
      res.send(one);
    }).catch((err) => {
      errorHandler(req, res, err.message);
    });
    return;
  }
}

const shopHandler = new RestAPIHandler(ShopModel);
const tagHandler = new RestAPIHandler(TagModel);

module.exports = {
  loadUserHandler,
  shopHandler,
  tagHandler,
};