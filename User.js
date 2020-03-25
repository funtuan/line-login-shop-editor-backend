const { MemberModel } = require('./mongooseSchema.js');

class User {
  constructor() {
    this.me = null;
  }

  async login(id_token) {
    const members = await MemberModel.find({sub: id_token.sub});
    if (members.length > 0) {
      // 已註冊
      this.me = members[0];
    } else {
      // 未註冊
      const member = new MemberModel(id_token);
      await member.save();
      this.me = member;
    }
  }

  async updateModel(data, Model) {
    console.log(data, Model);
    let one;
    if ('_id' in data) {
      // 更新
      try {
        one = await Model.findOne({ _id: data['_id'] });
      } catch (error) {
        throw new Error('查無該id');
      }
      for (const [key, value] of Object.entries(data)) {
        one[key] = value;
      }
    } else {
      // 新增
      one = new Model(data);
      one.changeRecord = [];
    }
    one.changeRecord.push({
      userSub: this.me.sub,
      name: this.me.name,
      time: new Date(),
      change: data,
    });
    await one.save();
    return one;
  }

  async removeModel(_id, Model) {
    const one = await Model.findOne({ _id });
    await one.remove();
    return one;
  }

  async getModel(_id, Model) {
    let list = [];
    try {
      if (_id) {
        list = await Model.find({ _id });
      } else {
        list = await Model.find({}).sort('_id');
      }
    } finally {
      return list;
    }
  }
}

module.exports = User;