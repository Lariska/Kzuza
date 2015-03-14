var rotate = function(cls) {
    document.querySelector(cls).classList.toggle("flip");
};

$(document).ready(function() {
    rotate(".first");
    setTimeout(function() {
        rotate(".first");
        setTimeout(function() {
            rotate(".first");
            setTimeout(function() {
                $(".flippers .first .back").css("background-color", "forestgreen");
                $(".flippers .progress").width("65%");
                rotate(".second");
                setTimeout(function() {
                    rotate(".second");
                    setTimeout(function() {
                        rotate(".second");
                        setTimeout(function() {
                            $(".flippers .second .back").css("background-color", "forestgreen");
                            $(".flippers .progress").width("100%");
                            rotate(".third");
                            setTimeout(function() {
                                rotate(".third");
                                setTimeout(function() {
                                    rotate(".third");
                                    setTimeout(function() {
                                        $(".flippers .third .back").css("background-color", "forestgreen");
                                        $('body').fadeOut(3000, function() {window.location.href="/daily_meal"});
                                    }, 3000);
                                }, 3000);
                            }, 3000);
                        }, 3000);
                    }, 3000);
                }, 3000);
            }, 3000);
        }, 3000);
    }, 3000);
});