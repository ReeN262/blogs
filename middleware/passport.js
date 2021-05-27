const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('../db')
const {secret} = require('../secretkey')
opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (payload, done) => {
            try {
                console.log(payload.userID)
                const user = await db.query('select email,id_user from person where id_user = $1', [payload.userID])
        
                if (user.rowCount != 0) {
                    done(null, user.rows)
                } else {
                    done(null, false)
                }
            } catch(e) {
                console.log(e)
            }
        })

    )
}