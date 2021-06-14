const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const knex = require('../database/db')
const {secret} = require('../config/secretkey')
opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (payload, done) => {
            try {
                const user = await knex('users').select('name', 'email', 'id').where({id: payload.userID})
                if (user.rowCount != 0) {
                    done(null, {
                    id: user[0].id,
                    name: user[0].name, 
                    email: user[0].email})
                } else {
                    done(null, false)
                }
            } catch(e) {
                console.log(e)
            }
        })

    )
}