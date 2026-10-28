const path = require('path')

// Load backend/.env before importing the app, independent of the shell's cwd.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = require('./app')
const { startNotificationRealtime } = require('./features/notifications/notifications.service')

const PORT = process.env.PORT || 5000
startNotificationRealtime()
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
