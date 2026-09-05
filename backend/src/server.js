const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', async(req,res)=>{
    const { data, error} = await supabase.auth.getSession()
    if (error) return res.status(500).json({error: error.message})
    res.json({ message: 'Connected to Supabase!', data})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`))

