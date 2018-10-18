var mongoose = require('mongoose');

//Dishes Schema
var dishSchema = mongoose.Schema({
	dishName:{
		type: String,
		required : true
	},
	dishIngredients:{
		type: String,
		required : true
	},
	dishPrice:{
		type: String,
		required : true
	},
    type:{
		type: String,
		required : true
	},
	restaurantName:{
		type: String,
		required : true
	},
	restaurantAddress:{
		type: String,
		required : true
	},
	restaurantEmail:{
		type: String,
		required : true
	},
	restaurantPhone:{
		type: String,
		required : true
	},
    buy_url:{
		type: String,
		required : true        
    },
	create_date:{
		type: Date,
		default: Date.now
	}	
});

//Dish Schema
var Dish = module.exports = mongoose.model('Dish',dishSchema);

//Get All Dishes from the database
module.exports.getDishes = function(callback, limit){
	Dish.find(callback).limit(limit);
}

//Get Specific Dish by id from the database
module.exports.getDishById = function(id, callback){
	Dish.findById(id, callback);
}

//Get Dishes by type on Main Screen from the database
module.exports.getDishesByType = function(types, callback, limit){
    Dish.find({type : types}, callback).limit(limit);
}

//Search by Dish Name from the database
module.exports.getDishesByName = function(name, callback, limit){
    Dish.find({dishName : {$regex: name, $options:"$i"}}, callback).limit(limit);
}


//Search by Dish spacific Ingredients from the database
module.exports.getDishesByIngredients = function(name, callback, limit){
    Dish.find({dishIngredients : {$regex: name, $options:"$i"}}, callback).limit(limit);
}




//Add Dishes From website to the database
module.exports.insertDishes = function(food, callback){
    Dish.create(food, callback);
}

//Delete Dishes from the database
module.exports.removeDishes = function(id, callback){
    var query = {_id : id};
    Dish.remove(query, callback);
}
