require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();

app.use(cors({
    origin: 'https://anything-ai-assignment.vercel.app/',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false })
    .then(() => {
        console.log("Database connected.");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log(err));

// Only run app.listen if we are NOT in production (e.g. running locally)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;