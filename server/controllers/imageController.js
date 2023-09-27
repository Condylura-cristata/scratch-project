const db = require('../db')

const imageController = {};

imageController.getImages = async (req, res, next) => {
    try {
        const query =`SELECT * FROM images`;
        const results = await db.query(query);
        res.locals.images = results.rows;
        return next();
    } catch (err) {
        return next({
            log:`imageControllers.getImages: ERROR: ${err}`,
            message: {err: 'Error occured in imageController.getImage. Check logs for more details.'}
        })
    }
};

imageController.addImage = async (req, res, next) => {
    const {
        userId,
        title,
        description,
        url,
        artist
    } = req.body

    console.log(title, description, url,artist);

    try {
        const query =`INSERT INTO images (user_id, title, url, description,artist)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
            userId,
            title,
            url,
            description,
            artist
        ]
        const results = await db.query(query, values);
        res.locals.newImage = results.rows[0];
        return next();
    } catch (err) {
        return next({
            log:`imageControllers.addImage: ERROR: ${err}`,
            message: {err: 'Error occured in imageController.addImage. Check logs for more details.'}
        })
    }
}





module.exports = imageController;