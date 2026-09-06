const supabase = require('../config/supabase');

function requireAdmin(req, res, next) {
    supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single()
        .then(({data, error})=>{
            if (error || !data){
                return res.status(401).json({error: 'Profile not found'})
            }
            if (data.role !== 'admin') {
                return req.status(401).json({error: 'Admin access required'})
            }
            next()
        })

}

module.exports = requireAdmin;