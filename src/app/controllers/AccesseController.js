import Accesse from '../models/Accesse';

// code is working but access testing is in trouble, apparently has to do with my custom attributes part

class AccesseController {
  async show(req, res) {
    const accesse = await Accesse.findAll({
      where: { link_id: req.params.link_id, user_id: req.userId },
      attributes: [
        [
          Accesse.sequelize.fn(
            'date_trunc',
            'day',
            Accesse.sequelize.col('created_at')
          ),
          'date',
        ],
        [Accesse.sequelize.fn('count', Accesse.sequelize.col('id')), 'count'],
      ],
      group: '"date"',
      order: Accesse.sequelize.literal('date DESC'),
      limit: 5,
    });

    const labels = await accesse.map(label => label.dataValues.date);
    await labels.reverse();
    const data = await accesse.map(label => label.dataValues.count);
    await data.reverse();

    return res.json({ labels, data });
  }
}

export default new AccesseController();
