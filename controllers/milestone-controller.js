const db = require('../models')
const User = db.user

exports.completeTask = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    
}