var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');


app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

Dish = require('./models/dishModel');

//Connect to mongoose
mongoose.connect('mongodb://localhost/foodworld');
var db = mongoose.connection;
var time = 0;

//To Get All the dishes from database
app.get('/api/dishes', function(req, res){
    var type = req.query.type;
    var name = req.query.name;
    
    //To get all the dishes from database
    if(type === undefined && name === undefined){
        Dish.getDishes(function(err,dishes){
            if(err){
                throw err;
            }
            res.json(dishes);
        });	
    }
    else{
        //To get dishes by type
        if(type !== undefined && name === undefined){
            Dish.getDishesByType(type ,function(err,dishes){
                if(err){
                    throw err;
                }
                res.json(dishes);
            });
        }
        else{
            //To get dishes by name
            Dish.getDishesByName(name ,function(err,dishes){
                if(err){
                    throw err;
                }
                if(dishes.length == 0){
                    //To get dishes by Ingredients 
                    Dish.getDishesByIngredients(name ,function(err,dishes){
                        if(err){
                            throw err;
                        }
                        res.json(dishes);    
                    });
                }
                else{
                    res.json(dishes);                
                }
            });
            
        }
	
    }    
    
});


//Get the dish by id from database or Specific Dish 
app.get('/api/dishes/:_id', function(req, res){
	Dish.getDishById(req.params._id, function(err, dish){
		if(err){
			throw err;
		}
		res.json(dish);
	});	
});


//Fetch Dishes from websites and store them in mongoDB
//Add new dish in database
app.post('/api/dishes/', function(req, res){
    if(time == 0){
        time=time+1;
        //After calling once this function will inactive for 24 hours.
        setTimeout(function(){ time = 0; }, 86400000);// for 24 hours 86400000 
    
        
        Dish.getDishes(function(err,dishes){
            if(err){
                throw err;
            }
            
            if(dishes.length != 0){
                for(var i = 0; i < dishes.length; i++){
                    Dish.removeDishes(dishes[i]._id, function(err, dish){
                       if(err){
                           throw err;
                       }
                           
                    });
                }
                    
            }
            
        });	
        
        
        
        //The code for feacting data from website is written as per that particular website is designed.
        
        var restaurantName;
        var restaurantAddress;
        var restaurantEmail;
        var restaurantPhone;

        //First restaurant Main Course
        var url = "http://www.littleindia-dresden.de/menu/vegetarsiche-gerichte";
        
        request(url, function(err, response, html){
            var names = [];
            var ingredients = [];
            var prices = [];
            var types = [];
            
            if(!err){
                var $ = cheerio.load(html);
                var dishtype = "Main Course"; //$("h1.title").text();
                var allItems = $("tbody").children();
                allItems.each(function(index){
                    var firsttd = allItems.eq(index).children("td").eq(0).text();
            
                    if(firsttd !== ""){
                        names.push(allItems.eq(index).children("td").eq(1).text());
                        prices.push(allItems.eq(index).children("td").eq(2).text().replace(/\n/g, ''));
                        types.push(dishtype);
                    } 
                    else{
                        ingredients.push(allItems.eq(index).children("td").eq(1).text());
                    }
                });
        
                var restroData = $("#copyright").text();
       
                restaurantName = restroData.substring(25,37);
                restaurantAddress = restroData.substring(48,77);
                restaurantEmail = restroData.substring(80,107);
                restaurantPhone = restroData.substring(115,128);
        
                var food;
                for(var i = 0; i< names.length; i++){
                    food = JSON.stringify({"dishName":names[i], "dishIngredients":ingredients[i], "dishPrice":prices[i], "type":types[i], "restaurantName": restaurantName, "restaurantAddress":restaurantAddress, "restaurantEmail": restaurantEmail, "restaurantPhone":restaurantPhone, "buy_url" :"http://www.littleindia-dresden.de/menu/vegetarsiche-gerichte"});
                    
                    food = JSON.parse(food);
                
                    Dish.insertDishes(food, function(err,food){
                        if(err){
                            throw err;
                        }   
                    });                    

                }
            }//end of if
        });//end of request() main course Little India    

        
        ////First restaurant Starters
        var url= "http://www.littleindia-dresden.de/menu/vorspeise";
        request(url, function(err, response, html){
            var names = [];
            var ingredients = [];
            var prices = [];
            var types = [];

        
            if(!err){
                var $ = cheerio.load(html);
                var dishtype = "Starter";//$("h1.title").text();
                var allItems = $("tbody").children();
                allItems.each(function(index){
                    var firsttd = allItems.eq(index).children("td").eq(0).text();
            
                    if(firsttd !== ""){
                        names.push(allItems.eq(index).children("td").eq(1).text());
                        prices.push(allItems.eq(index).children("td").eq(2).text().replace(/\n/g, ''));
                        ingredients.push("-");
                        types.push(dishtype);
                    } 
                });
            
                var restroData = $("#copyright").text();
        
                restaurantName = restroData.substring(25,37);
                restaurantAddress = restroData.substring(48,77);
                restaurantEmail = restroData.substring(80,107);
                restaurantPhone = restroData.substring(115,128);

                var food;
                for(var i = 0; i< names.length; i++){
                    food = JSON.stringify({"dishName":names[i], "dishIngredients":ingredients[i], "dishPrice":prices[i], "type":types[i], "restaurantName": restaurantName, "restaurantAddress":restaurantAddress, "restaurantEmail": restaurantEmail, "restaurantPhone":restaurantPhone, "buy_url" : "http://www.littleindia-dresden.de/menu/vorspeise"});
                    food = JSON.parse(food);

                    Dish.insertDishes(food, function(err,food){
                        if(err){
                            throw err;
                        }
                    });                  
                }
            }//end of if
        });//end of request() Starters Little India
    
        
        ////First restaurant Desserts
        var url= "http://www.littleindia-dresden.de/menu/dessert";
    
        request(url, function(err, response, html){
            var names = [];
            var ingredients = [];
            var prices = [];
            var types = [];


            if(!err){
                var $ = cheerio.load(html);
                var dishtype = "Dessert";//$("h1.title").text();
                var allItems = $("tbody").children();
                
                allItems.each(function(index){
                    var firsttd = allItems.eq(index).children("td").eq(0).text();
            
                    if(firsttd !== ""){
                        var name = allItems.eq(index).children("td").eq(1).text().replace(/\n/g, '').split('(');
                        names.push(name[0].trim());
                        prices.push(allItems.eq(index).children("td").eq(2).text().replace(/\n/g, ''));
                        var ingre = name[1].split(')');
                        ingredients.push(ingre[0].trim());
                        types.push(dishtype);
                    } 
                });

                var restroData = $("#copyright").text();
        
                restaurantName = restroData.substring(25,37);
                restaurantAddress = restroData.substring(48,77);
                restaurantEmail = restroData.substring(80,107);
                restaurantPhone = restroData.substring(115,128);
        
                var food;
            
                for(var i = 0; i< names.length; i++){
                    food = JSON.stringify({"dishName":names[i], "dishIngredients":ingredients[i], "dishPrice":prices[i], "type":types[i], "restaurantName": restaurantName, "restaurantAddress":restaurantAddress, "restaurantEmail": restaurantEmail, "restaurantPhone":restaurantPhone, "buy_url" : "http://www.littleindia-dresden.de/menu/dessert"});
                    food = JSON.parse(food);

                    Dish.insertDishes(food, function(err,food){
                        if(err){
                            throw err;
                        }
                    });                    
                }
            }//end of if
        });//end of request() Desserts Little India

        
        
        //Second restaurant
        var url = "https://bombay-palast.de/karte.html";
    
        request(url, function(err, response, html){
            var names = [];
            var ingredients = [];
            var types = [];
            var prices = [];
            
            if(!err){
                var $ = cheerio.load(html);
                var allItems = $("tbody").children();
        
                allItems.each(function(index){
                    var ingredient = allItems.eq(index).children("td").eq(1).children().eq(1).text();
                    if(ingredient !== ""){
                        var nm = allItems.eq(index).children("td").eq(1).text().split(ingredient);
                        names.push(nm[0]);
                        ingredients.push(ingredient);
                    }
                    else{
                        names.push(allItems.eq(index).children("td").eq(1).text());
                        ingredients.push("-");
                    }
            
                    prices.push(allItems.eq(index).children("td").eq(2).text());
            
            
                    if(index > 98 && index < 104){
                        types.push("Dessert");               
                    }
                    else{
                        if(index > 2 && index < 19){
                            types.push("Starter");
                        }
                        else{
                            types.push("Main Course");
                        }
                    }              
                });
                

        
                var food;
                for(var i = 0; i< names.length; i++){
                    food = JSON.stringify({"dishName":names[i], "dishIngredients":ingredients[i], "dishPrice":prices[i], "type":types[i], "restaurantName": "Bombay Palast", "restaurantAddress": "Straße der Nationen 41b 09111 Chemnitz", "restaurantEmail" : "info@bombay-palast.de" , "restaurantPhone": "+49(0)371/45906110", "buy_url" :"https://bombay-palast.de/karte.html"});
                    
                    food = JSON.parse(food);

                    Dish.insertDishes(food, function(err,food){
                        if(err){
                            throw err;
                        }
                    });
                }
            }//end of if()
        });//end of request() bombay-palast    
    
        
        //Third restaurant
        var url = "http://www.safran-leipzig.de/index.php";
        
        request(url, function(err, response, html){
            var names = [];
            var ingredients = [];
            var prices = [];
            var types = [];
            
            if(!err){
                var $ = cheerio.load(html);
                var allItems = $("section.food").children();
                allItems.each(function(index){
                    var name = allItems.eq(index).children().eq(1).text();
                    if(name !== ""){
                        names.push(name);
                    }
            
                    var price = allItems.eq(index).children().eq(2).text();
                    if(price !== ""){
                        prices.push(price);
                    }        
                });
        
                var allItems = $("p.littledesc");
                allItems.each(function(index){
                    ingredients.push(allItems.eq(index).text());
            
                    if(index >= 0 && index <= 14){
                        types.push("Starter");
                    }
                    else{
                        if(index >=15 && index <= 94){
                            types.push("Main Course");                    
                        }
                        else
                            types.push("Dessert");
                    }
                });
            

                var food;
                for(var i = 0; i< names.length; i++){
                    food = JSON.stringify({"id": i,"dishName":names[i], "dishIngredients":ingredients[i], "dishPrice":prices[i], "type":types[i], "restaurantName": "Safran" , "restaurantAddress": "Karl-Liebknecht-Straße 57, 04107 Leipzig", "restaurantEmail": "kontakt@safran-leipzig.de", "restaurantPhone": "0341-8607723", "buy_url" : "http://www.safran-leipzig.de/index.php"});
                
                    food = JSON.parse(food);

                    Dish.insertDishes(food, function(err,food){
                        if(err){
                            throw err;
                        }
                    });                    
                }
            }//end of if
        });//end of request() Safran
    }//if(time == 0)
    else{
        console.log("Already clicked");
        res.json("You have to wait for 24 hours to refresh the list");
    }
});//end of post()

app.listen(9090);
console.log("Running on port 9090");	