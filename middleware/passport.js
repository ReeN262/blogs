const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('../database/db')
const {secret} = require('../config/secretkey')
opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (payload, done) => {
            try {
                const user = await db.query('select email,name,id from users where id = $1', [payload.userID])
                if (user.rowCount != 0) {
                    done(null, {
                    id: user.rows[0].id,
                    name: user.rows[0].name, 
                    email: user.rows[0].email})
                } else {
                    done(null, false)
                }
            } catch(e) {
                console.log(e)
            }
        })

    )
}