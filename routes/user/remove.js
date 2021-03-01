const schedule = require("node-schedule");
const joi = require("joi");

const { User, sequelize, Review } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = res.locals.user;
  const {email}=req.body;
  const end = new Date();
  end.setDate(end.getDate() + 30);

  const schema = joi.object().keys({
    email: joi.string().email().max(40).required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const t = await sequelize.transaction();
  try {
    const exUser=await User.findByPk(id, {
      transaction:t
    });
    if(!exUser){
      await t.rollback();

      return res.status(404).end();
    }
    if(exUser.email!==email){
      await t.rollback();
      
      return res.status(403).end();
    }

    await Review.update(
      { nick: "(알 수 없음)" },
      { where: { userId: id }, transaction: t }
    );
    await User.destroy({ where: { id }, transaction: t });

    schedule.scheduleJob(end, () => {
      User.destroy({ where: { id }, force: true });
    });

    await t.commit();

    return res.redirect("/api/auth/logout");
  } catch (error) {
    await t.rollback();

    return next(error);
  }
};
