
var  angularApp = angular.module('angularApp', ['ngResource']);

angularApp.factory('Menu', function($resource){
    //return $resource('/data/menu/:id');//, {id: '@_id'});
    return {
        titles: $resource('/data/menu/:id'),
        innerItems: $resource('/data/menuItem/:id', {id: '@_id'})
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

    //$scope.template = "";
    //$scope.select = function(menuPart){
    //    setTemplate(menuPart)
    //    menu.forEach(function(part){
    //        if(menuPart===part)
    //            part.selected = true;
    //        else
    //            part.selected = false;
    //    });
    //};
    //
    //function setTemplate(item){
    //    $scope.template = "h1 " + item.title;
    //    item.items.forEach(function (innerItem){
    //        $scope.template +="h2 "+ innerItem.name +
    //        "p " + innerItem.price +
    //        "br " + innerItem.description;
    //    });
    //    $('manuArea').text($scope.template)
    //}

    //$scope.isSelected = function(part){
    //    return part.selected;
    ////};
    //this.tab = 2;
    //$scope.isTab = function(Tab){
    //    return this.tab === Tab;
    //};
    //$scope.setTab = function(Tab){
    //    this.tab = Tab;
    //};

//});
//angularApp.controller('menuTabs', function($scope){
//    $scope.tab = 1;
//    $scope.isTab = function(Tab){
//        return $scope.tab === Tab;
//    }
//    $scope.setTab = function(Tab){
//        $scope.tab = Tab;
//    }
//})

angularApp.factory('menu', function(){

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