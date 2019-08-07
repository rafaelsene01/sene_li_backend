import Sequelize, { Model } from 'sequelize';

class Link extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        title: Sequelize.STRING,
        url: Sequelize.STRING,
        redirect_url: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Link;
