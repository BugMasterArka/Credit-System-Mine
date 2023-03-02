const express = require('express');
const app = express();

app.use(express.json());
const port = 5000;

// available routes
app.use('/api/student',require('./routes/Student'));

app.listen(port,()=>{
    console.log(`Server Running on port ${port}`);
});