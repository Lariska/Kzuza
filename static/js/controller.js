
var  angularApp = angular.module('angularApp', ['ngResource', 'ngCookies']);

angularApp.factory('Menu', function($resource){
    //return $resource('/data/menu/:id');//, {id: '@_id'});
    return {
        titles: $resource('/data/menu/:name'),  //,{name: '@_name'}),
        innerItems: $resource('/data/menuItem/:id', {id: '@_id'})
    }
});

angularApp.factory('Salad', function($resource){
    return{
        ingredients: $resource('/data/ingredients/:type'),
        sauce: $resource('/data/sauce/:id'),
        extra: $resource('/data/extra/:id')
    }
});

angularApp.factory('Order', function($resource){
    return{
        cart: $resource('/data/order/:id', {id: '@_id'})
    }
});

angularApp.controller('menuController',function($scope, Menu) {

    $scope.tab = 0;

    Menu.titles.query(function(data){
        data.forEach(function(title){
            Menu.innerItems.query({id: title._id}, function(items){
                title.items = items;
            });
        });
        $scope.menu = data;
    });

    $scope.setTab = function(setTab){
        $scope.tab = setTab;
    };
    $scope.isTab = function(selectedTab){
        return selectedTab===$scope.tab
    };
});

angularApp.controller('sandwichCtrl', function($scope, Menu, Order, $http){
    Menu.titles.get({name: "sandwich"}, function(title){
        //var sandwich = title;
        Menu.innerItems.query({id: title._id}, function(items){
            $scope.sandwiches = items;

        });
    });
    $scope.select = "לא נבחר"
    $scope.over = function(sandwich){
        $scope.select = sandwich;
    };
    $scope.sandwichSelect = function(sandwich){
        $scope.select = sandwich;
        $http.post('/order/item/' + sandwich._id, {item: sandwich})
            .success(function(data, status, headers, config){
                $scope.cart = data;
            });
    };
});

angularApp.controller('saladCtrl', function ($scope, Salad, $http) {
    Salad.ingredients.query({type: 'ingredients'}, function (data) {
        $scope.ingredients = data;
    });
    Salad.ingredients.query({type: 'sauce'}, function (data) {
        $scope.sauce = data;
    });
    Salad.ingredients.query({type: 'extra'}, function (data) {
        $scope.extra = data;
    });

    $scope.price = 27;

    function calculatePrice() {
        $scope.price = sizeP + saucePrice + extrasPrice;
    };

    var sizeP = 27;
    $scope.chooseSize = function (priceSize) {
        sizeP = priceSize;
        calculatePrice();
    };
    var sauceCount = 0;
    var saucePrice = 0;
    $scope.addSauce = function (chack) {
        if (chack === true) sauceCount++;
        if (chack === false) sauceCount--;
        if (sauceCount >= 2) saucePrice = (sauceCount - 2) * 2;
        calculatePrice();
    };

    var extrasCount = 0;
    var extrasPrice = 0;
    $scope.addExtra = function (chack) {
        if (chack === true) extrasCount++;
        if (chack === false)extrasCount--;
        if (extrasCount >= 1) extrasPrice = (extrasCount - 1) * 4;
        calculatePrice();
    };

});

angularApp.controller('orderCtrl', function($scope, Menu, Salad, Order, $cookies){
    //$scope.cart = $cookies.get('cart');
    Order.cart.get(function(data){
        $scope.cart = data;
    });
});

var menu1 = [{
        selected: true,
        index: 1,
        title: "סלטים",
        image: "/images/food/salad.jpg",
        items: []
    },{
        selected: false,
        index:2,
        title: "סנדווצים",
        image: "/images/food/harkava.jpg",
        items: [{
            name: "סנדוויץ בהרכבה עצמית",
            price:"27",
            description:"ממרח לבחירה, תוספת לבחירה, ירקות טריים לבחירה"
        },{
            name: "סנדוויץ בריאות",
            price:"27",
            description:"ממרח עגבניות מיובשות, גבינה בולגריפרוסות עגבניהת עלי בזיליקום, נבטים, פיטריות טריות"
        },{
            name: "סנדוויץ סביח",
            price:"27",
            description:"טחינה, חציל קלוי ביצה קשה מלפפון חמוץ"
        }]
    },{
        selected: false,
        index:3,
        title: "שווה בקצוצה",
        image: "/images/food/shave.jpg",
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
        selected: false,
        index:4,
        title: "טוסטים",
        image: "/images/food/tost.jpg",
        items: [{
            name:"טוסט גבינה צהובה",
            price:"17",
            description:"כל תוספת 2 שקלים"
        }]
    }
];