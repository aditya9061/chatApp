
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    name:{
        type:String,
        default:'Anonymous'
    },
    content:{
        type:String,
        required:true
    }
}, {
    timestamps:true
});

module.exports = mongoose.model('Message', messageSchema);