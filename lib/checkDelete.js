const { User } = require("../models");
const { Op } = require("sequelize");

module.exports = async (req, res, next) => {
  const end = new Date();
  end.setDate(end.getDate() - 30);
  const temp=new Date();
  temp.setDate(end.getDate()-3);

  try {
    await User.destroy({
      where: {
        [Op.or]:[
          {deletedAt: { [Op.lte]: end }},
          {[Op.and]:[
            {eVerified:false},
            {createdAt:{[Op.lte]:temp}}
          ]}
        ]
      },
      force: true,
    });

    delete end;
    delete temp;

    next();
  } catch (e) {
    next(e);
  }
};
