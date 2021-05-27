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
                const user = await db.query('select email,name from users where email = $1', [payload.email])
                if (user.rowCount != 0) {
                    done(null, {name: user.rows.name, 
                    email: user.rows.email})
                } else {
                    done(null, false)
                }
            } catch(e) {
                console.log(e)
            }
        })

    )
}