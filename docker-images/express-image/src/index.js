var Chance = require('chance');
var chance = new Chance();
var express = require('express')
var app = express();


app.get('/test',function (req,res) {
    res.send(generateCity())
})

app.get('/',function (req,res) {
    res.send(generateCity());
})


app.listen(3000,function () {
    console.log("Accepting HTTP on port 3000");
})


function generateCity(){
    var numberOfCity = chance.integer({
        min :0,
        max :10
    });
    var city =[];
    for(var i = 0 ; i < numberOfCity;i++){
        city.push({
            city:chance.city()
        });
    };

    console.log(city);
    return city;

}