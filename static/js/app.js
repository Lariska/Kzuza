

var  angularApp = angular.module('angularApp', []);

angularApp.controller('menuController',function($scope){
    $scope.mean = menu;
});
angularApp.controller('menuTabs', function(){

})

angularApp.factory('menu', function(){

});

var menu = [
    {
        title: "סנדווצים",
        image: "",
        items: [{
            mane: "סנדוויץ בהרכבה עצמית",
            price:"27",
            description:"ממרח לבחירה, תוספת לבחירה, ירקות טריים לבחירה"
        },{
            mane: "סנדוויץ בריאות",
            price:"27",
            description:"ממרח עגבניות מיובשות, גבינה בולגריפרוסות עגבניהת עלי בזיליקום, נבטים, פיטריות טריות"
        },{
            mane: "סנדוויץ סביח",
            price:"27",
            description:"טחינה, חציל קלוי ביצה קשה מלפפון חמוץ"
        }]
    },{
        title: "שווה בקצוצה",
        image: "",
        items: [{
            name: "קצוצה 500",
            price: "33",
            description: "+פחית שתיה"
        },{
            name: "קצוצה 750",
            price: "37",
            description: "+פחית שתיה"
        }]
    },{
        title: "טוסטים",
        image: "",
        items: [{
            name:"טוסט גבינה צהובה",
            price:"17",
            description:"כל תוספת 2 שקלים"
        }]
    }
];