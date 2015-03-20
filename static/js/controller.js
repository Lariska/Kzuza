
var  angularApp = angular.module('angularApp', ['ngResource', 'ngCookies', 'ngAnimate']);

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
    var num = 0;
    var prc = 0;
    //$resource('/data/order').get( function(data){
    //    data.items.forEach(function(item){
    //        Menu.innerItems.get({id: item}, function(data){
    //            this.items.push(data);
    //        });
    //    });
    //    data.salads.forEach(function(item){
    //        Salad.salad.get({id: item}, function(data){
    //            sad.push(data);
    //        });
    //    });
    //});

    return{
        cart: $resource('/data/order/:id/:salad', {id: '@_id'}),
        fullCart: $resource('/data/fullCart'),
        items: itm,
        salads: sad,
        //numOfItm: num,
        //price: prc,
        //numOfItems: function() {return ++num},
        //addPrice: function(prc) {return this.price =+ prc},
        addSandwich: function(sandwich){
            itm.push(sandwich);
            //this.price = this.addPrice(sandwich.price);
            //this.numOfItm = this.numOfItems();
        }
        //},
        //addItem: function(){ return ++num; },
        //price: function(){ var total = 0;
        //    for( itemm in itm){
        //        total += itemm.price;
        //    }
        //    for( saladd in sad ){
        //        total += saladd.price;
        //    }
        //    return total;
        //}
    }
});

angularApp.controller('menuController',function($scope, Menu) {

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
});

angularApp.controller('sandwichCtrl', function($scope, Menu, Order, $http){
    Menu.titles.get({name: "sandwich"}, function(title){
        //var sandwich = title;
        Menu.innerItems.query({id: title._id, list: true}, function(items){
            $scope.sandwiches = items;

        });
    });
    $scope.select = "�?�? נבחר"
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

    var extrasCount = 0;
    var extrasPrice = 0;
    $scope.addExtra = function (chack, id) {
        if (chack === true) extrasCount = add(ex, id);
        if (chack === false) extrasCount = remove(ex, id);
        if (extrasCount >= 1) extrasPrice = (extrasCount - 1) * 4;
        calculatePrice();
    };

    $scope.sddSalad = function(){
        $http.post('/order/salad', {size: size, ing: ing, suc: suc, ex: ex, price: $scope.price})
            .success(function(data, status, headers, config){
                //todo: push salad correct
                Order.salads.push(data.salads);
                $scope.cart = data;
            });
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

angularApp.controller('orderCtrl', function($scope, Menu, Salad, Order, $cookies){
    //var cartP = $cookies.get('cart');
    var items = [];
    var salads = [];

    $scope.itemsInCart = items;
    $scope.saladsInCart = salads;

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

angularApp.controller('cartCtrl', function($scope, Order, Menu, Salad, $cookies){
    //var itm = [];
    //var sad = [];
    //Order.items = itm;
    //Order.salads = sad;

    //var max = 0;

    //var t = Order.items;
    $scope.num = 0;
    $scope.price = 0;

    $scope.items = Order.items;
    $scope.salads = Order.salads;
    //var len = 0;
    //$scope.num = 0;
    Order.cart.get( function(data){
        $scope.cart = data;
        data.items.forEach(function(item){
            Menu.innerItems.get({id: item}, function(data){
                Order.addSandwich(data);
                //Order.items.push(data);
                //Order.addItem();
                //len++;
                //Order.numOfItems++;
                //$scope.num++;
                //$scope.num = Order.addItem();
            });
        });
        data.salads.forEach(function(item){
            Salad.salad.get({id: item}, function(data){
                Order.salads.push(data);
                //len++
                //Order.numOfItems++;
                //$scope.num++
            });
        });
    });
    //var int =
    //$scope.num = len;

    $scope.deleteItem = function(item){
        var idx = $scope.items.indexOf(item);
        $scope.items.splice(idx, 1);
        Order.cart.remove({id: item._id}, function(doc){});
    };
    $scope.items.forEach(function(item){
        $scope.price += item.price;
        $scope.num++;
    });
    $scope.menu = false;
    $scope.open = function(){ $scope.menu = true };
    $scope.close = function(){ $scope.menu = false };
    //$scope.num = t.length;
    //$scope.num = Order.numOfItems();
    //$scope.price = Order.price;
});

var menu1 = [{
        selected: true,
        index: 1,
        title: "ס�?טי�?",
        image: "/images/food/salad.jpg",
        items: []
    },{
        selected: false,
        index:2,
        title: "סנדווצי�?",
        image: "/images/food/harkava.jpg",
        items: [{
            name: "סנדוויץ בהרכבה עצ�?ית",
            price:"27",
            description:"�?�?רח �?בחירה, תוספת �?בחירה, ירקות טריי�? �?בחירה"
        },{
            name: "סנדוויץ ברי�?ות",
            price:"27",
            description:"�?�?רח עגבניות �?יובשות, גבינה בו�?גריפרוסות עגבניהת ע�?י בזי�?יקו�?, נבטי�?, פיטריות טריות"
        },{
            name: "סנדוויץ סביח",
            price:"27",
            description:"טחינה, חצי�? ק�?וי ביצה קשה �?�?פפו�? ח�?וץ"
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
        title: "טוסטי�?",
        image: "/images/food/tost.jpg",
        items: [{
            name:"טוסט גבינה צהובה",
            price:"17",
            description:"כ�? תוספת 2 שק�?י�?"
        }]
    }
];

