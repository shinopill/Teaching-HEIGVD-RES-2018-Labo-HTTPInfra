

$(function(){
    console.log("Loading cities");

    function loadCities() {
        $.getJSON("/api/city",function(cities) {
            var message = "No cities nearby";
            if (cities.length > 0){
                message = cities[0].city ;
            }
            $('.brand-heading').text(message);
        });
    }

    loadCities();
    setInterval(loadCities,2000);
});