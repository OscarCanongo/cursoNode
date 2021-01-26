const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (error) => {
    console.log(error);
});