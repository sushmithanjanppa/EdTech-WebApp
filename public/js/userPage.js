function dispUserType(){
    var userType = $('#userType').data("utype");
    userType = userType===0 ? 'Student' : 'Teacher';
    $('#userType').append(`${userType} `);
}dispUserType();

(function ($) {
    var editUserInfo = $('#editUserInfo');
    editUserInfo.click(function(event){
        event.preventDefault();
        let editInfo = {
                name: $('#name').data("name"),
                age: $('#age').data("age"),
                gen: $('#gender').data("gender"),
                email: $('#email').data("email"),
            };   
    });

    $('#fox-popup-triger').on('click', function () {
        $('.fox-popup-wrap').fadeIn(500);
        $("body").css("overflow", "hidden");
        return false;
    });
    $('.fox-close-btn').on('click', function () {
        $('.fox-popup-wrap').hide();
        $("body").css("overflow", "auto");
        return false;
    });

})(window.jQuery);

