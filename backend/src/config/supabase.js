const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Resolve the backend environment file relative to this source file, rather
// than process.cwd(), so starting the server from another directory is safe.
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

module.exports = supabase;
