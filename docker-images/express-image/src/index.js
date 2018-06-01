var Chance = require('chance');
var chance = new Chance();
var express = require('express')
var app = express();


app.get('/test',function (req,res) {
    res.send(generateStudents())
})

app.get('/',function (req,res) {
    res.send("generateStudents()");
})


app.listen(3000,function () {
    console.log("Accepting HTTP on port 3000");
})


function generateStudents(){
    var numberOfStudente = chance.integer({
        min :0,
        max :10
    });
    var students =[];
    for(var i = 0 ; i < numberOfStudente;i++){
        var gender = chance.gender();
        var birthYear = chance.year({
            min : 1988,
            max : 1998
        });

        students.push({
            firstName : chance.first({
                gender : gender
            }),
            lastName  : chance.last(),
            gender :gender,
            birthday :chance.birthday({
                year : birthYear
            })
        })
    };

    console.log(students);
    return students;

}