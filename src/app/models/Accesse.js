import Sequelize, { Model } from 'sequelize';

class Accesse extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        link_id: Sequelize.INTEGER,
        ip: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'link_id', as: 'link' });
  }
}

export default Accesse;
