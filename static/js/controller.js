
var  angularApp = angular.module('angularApp', ['ngResource', 'ngAnimate']);  ///   'ngCookies',

angularApp.factory('Recommend', function($resource){
    return $resource('/data/recommend')
});

angularApp.factory('Menu', function($resource){
    //return $resource('/data/menu/:id');//, {id: '@_id'});
    return {
        titles: $resource('/data/menu/:name'),  //,{name: '@_name'}),
        innerItems: $resource('/data/menuItem/:id')//, {id: '@_id'})
    }
});

angularApp.factory('Salad', function($resource){
    return{
        ingredients: $resource('/data/ingredients/:type'),
        sauce: $resource('/data/sauce/:id'),
        extra: $resource('/data/extra/:id'),
        salad: $resource('/data/salad/:id')
    }
});

angularApp.factory('Order', function($resource){
    var itm = [];
    var sad = [];
    var price = [0];
    var num = [0];
    return{
        cart: $resource('/data/order/:id/:salad', {id: '@_id'}),
        fullCart: $resource('/data/fullCart'),
        item: $resource('/order/item/:id', {id: '@_id'}),
        items: itm,
        salads: sad,
        price: price,
        numberOfItems: num,
        addSandwich: function(sandwich){
            itm.push(sandwich);
            var temp = price.pop();
            temp += parseInt(sandwich.price);
            price.push(temp);
            num.push( parseInt(num.pop()) + 1);
        },
        addSalad: function(salad){
            sad.push(salad);
            var temp = price.pop();
            temp += parseInt(salad.price);
            price.push(temp);
            num.push( parseInt(num.pop()) + 1);
        },
        dec: function(pdec){
            price.push( parseInt(price.pop()) - parseInt(pdec) );
            num.push( parseInt(num.pop()) - 1);
        }

    }
});

angularApp.controller('recommendController',function($scope, Recommend) {

    Recommend.query(function(data){
    $scope.recommendations = data;

    });
});

angularApp.controller('menuController',function($scope, Menu, Order) {

    $scope.tab = 0;

    Menu.titles.query(function(data){
        data.forEach(function(title){
            Menu.innerItems.query({id: title._id, list: true}, function(items){
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

    $scope.addItem = function(item, title){
        if(item.titleID == "54f74f7133766c581b837870") {
            Order.addSandwich(item);
            Order.item.save({id: item._id, item: item}, function(item){});
        }
        if(title == "salad"){
            switch (item.price){
                case "27": window.location = '/salad/size1';
                    break;
                case "31": window.location = '/salad/size2';
                    break;
                case "35": window.location = '/salad/size3';
                    break;
            }
        }

    };

    $scope.titleSelect = function(title) {
        if (title == "salad") window.location = '/salad';
        if (title == "sandwich") window.location = '/sandwich'
    };

});

angularApp.controller('sandwichCtrl', function($scope, Menu, Order, $http){
    Menu.titles.get({name: "sandwich"}, function(title){
        //var sandwich = title;
        Menu.innerItems.query({id: title._id, list: true}, function(items){
            $scope.sandwiches = items;

        });
    });
    $scope.select = "לא נבחר";
    $scope.over = function(sandwich){
        $scope.select = sandwich;
    };
    $scope.sandwichSelect = function(sandwich){
        //Order.items.push(sandwich);
        Order.addSandwich(sandwich);
        //Order.addItem();
        $scope.select = sandwich;
        $http.post('/order/item/' + sandwich._id, {item: sandwich})
            .success(function(data, status, headers, config){
                $scope.cart = data;
            });
    };
});

angularApp.controller('saladCtrl', function ($scope, Salad, Order, $http) {
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
        $scope.price = sizeP + (size*4) + saucePrice + extrasPrice;
    };

    var sizeP = 27;
    var ingCount = 0;
    var sauceCount = 0;
    var saucePrice = 0;
    var extrasCount = 0;
    var extrasPrice = 0;
    var size = 0;

    $scope.chooseSize = function (priceSize) {
        //sizeP = priceSize;
        size = (priceSize - 27)/4
        calculatePrice();
    };

    $scope.addIng = function(check, id){
        if (check === true) ingCount = add(ing, id);
        if (check === false) ingCount = remove(ing, id);
    };

    $scope.addSauce = function (chack, id) {
        if (chack === true) sauceCount = add(suc, id);
        if (chack === false) sauceCount = remove(suc, id);
        if (sauceCount >= 2) saucePrice = (sauceCount - 2) * 2;
        calculatePrice();
    };

    $scope.addExtra = function (chack, id) {
        if (chack === true) extrasCount = add(ex, id);
        if (chack === false) extrasCount = remove(ex, id);
        if (extrasCount >= 1) extrasPrice = (extrasCount - 1) * 4;
        calculatePrice();
    };

    $scope.sddSalad = function(){
        //var salad = {size: size, ingredients: ing, sauce: suc, extra: ex};
        Salad.salad.save( {size: size, ing: ing, suc: suc, ex: ex, price: $scope.price}, function(data){
            Order.addSalad(data);
        });
        //$http.post('/order/salad', {size: size, ing: ing, suc: suc, ex: ex, price: $scope.price})
        //    .success(function(data, status, headers, config){
        //        //todo: push salad correct
        //        //Order.salads.push(data.salads);
        //        Order.addSalad(data);
        //        //$scope.cart = data;
        //    });
    };

    function add(type, item){
        type.push(item);
        return type.length;
    }
    function remove(type, item){
        var indx = type.indexOf(item);
        type.splice(indx, 1);
        return type.length;
    }

    var ing = [];
    var suc = [];
    var ex = [];

});

angularApp.controller('orderCtrl', function($scope, Menu, Salad, Order){    ///, $cookies

    //var cartP = $cookies.get('cart');
    var items = [];
    var salads = [];

    $scope.itemsInCart = items;
    $scope.saladsInCart = salads;
    $scope.price = Order.price;

    Order.cart.get( function(data){
        $scope.cart = data;
        data.items.forEach(function(item){
            Menu.innerItems.get({id: item}, function(data){
                items.push(data);
                //Order.items.push(data);
            });
        });
        data.salads.forEach(function(item){
            Salad.salad.get({id: item}, function(data){
                salads.push(data);
                //Order.salads.push(data);
            });
        });
    });

    $scope.deleteItem = function(item){
        var index = items.indexOf(item);
        items.splice(index, 1);
        Order.cart.remove({id: item._id}, function(doc){});
    };

    $scope.deleteSalad = function(salad){
        var index = salads.indexOf(salad);
        salads.splice(index, 1);
        Order.cart.remove({id: salad._id}, function(doc){});
    };
});

angularApp.controller('cartCtrl', function($scope, Order, Menu, Salad){      ////$cookies


    $scope.items = Order.items;
    $scope.salads = Order.salads;
    $scope.price = Order.price;
    $scope.num = Order.numberOfItems;

    Order.cart.get( function(data){
        $scope.cart = data;
        data.items.forEach(function(item){
            Menu.innerItems.get({id: item}, function(itmData){
                Order.addSandwich(itmData);
            });
        });
        data.salads.forEach(function(salad){
            //confirm(salad);
            Salad.salad.get({id: salad}, function(salData){
                Order.addSalad(salData);
            });
        });
    });

    $scope.deleteItem = function(item){
        var idx = $scope.items.indexOf(item);
        $scope.items.splice(idx, 1);
        Order.cart.remove({id: item._id, price: item.price}, function(doc){});
        Order.dec(item.price);
    };

    $scope.deleteSalad = function(salad) {
        var idx = $scope.salads.indexOf(salad);
        $scope.salads.splice(idx, 1);
        Order.cart.remove({id: salad._id, price: salad.price}, function (doc) {});
        Order.dec(salad.price);
    };

    $scope.menu = false;
    $scope.open = function(){ $scope.menu = true };
    $scope.close = function(){ $scope.menu = false };

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

