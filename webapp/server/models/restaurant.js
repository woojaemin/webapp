var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/member', {useNewUrlParser: true});

var restaurantSchema = new mongoose.Schema({

    restaurant: {type:String, required:true},
    //image: {type:String},
    address: {type:String},
    telephone: {type:String},
    business_hours: {type:String},
    likes: [String]
});

module.exports = mongoose.model('restaurant',restaurantSchema);