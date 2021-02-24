const { User } = require("../models");
const { Op } = require("sequelize");

module.exports = async () => {
  const month = new Date();
  month.setDate(month.getDate() - 30);
  const days=new Date();
  days.setDate(days.getDate()-3);

  try {
    await User.destroy({
      where: {
        [Op.or]:[
          {deletedAt: { [Op.lte]: month }},
          {[Op.and]:[
            {eVerified:false},
            {createdAt:{[Op.lte]:days}}
          ]}
        ]
      },
      force: true,
    });
  } catch (err) {
    console.error(err);
  }
};
