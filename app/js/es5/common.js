(function () {
    'use strict';

    $('document').ready(function () {
        var trigger = $('#hamburger'),
            isClosed = true;

        trigger.click(function () {
            burgerTime();
        });

        function burgerTime() {
            if (isClosed == false) {
                trigger.removeClass('is-open');
                trigger.addClass('is-closed');
                isClosed = true;
            } else {
                trigger.removeClass('is-closed');
                trigger.addClass('is-open');
                isClosed = false;
            }
        }
        $("#hamburger").click(function () {

            console.log('hello');
            $('.for-menu').toggleClass('list-new');
            $(".open-menu-box").slideToggle();
        });
        // $('.thank-you').click(function() {
        //     $(this).hide();
        // });
        $('.button-crest').click(function () {
            $('.thank-you').hide();
            $('.thank-you').hide();
        });
        $('.button[data-form]').click(function () {
            $('.thank-you-form').show();
        });
        $(".list-head").on("click", "a", function (event) {
            event.preventDefault();
            var id = $(this).attr('href'),
                top = $(id).offset().top;
            $('body,html').animate({ scrollTop: top }, 500);
        });
        ///////////////// mail////////////////////

        var patternPhone = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,15}(\s*)?$/;
        $('form input').on('mouseover', function () {
            $(this).css('border', '1px solid #c6c6c6');
        });

        $('form').submit(function (event) {
            event.preventDefault();
            //event.preventDefault();
            var mname = $('form input[name="name"]').val();
            var mphone = $('form input[name="phone"]').val();

            //console.log(mname);
            if (!patternPhone.test(mphone)) {
                $('form input[name="phone"]').css('border', '1px solid red');
            }

            if (mname == "") {
                $('form input[name="name"]').css('border', '1px solid red');
            }
            if (mphone == "") {
                $('form input[name="phone"]').css('border', '1px solid red');
            }
            if (mname && mphone && patternPhone.test(mphone)) {

                $('.thank-you-form').hide();
                $('.thank-you-finish').show();

                var msg = $(this).serialize();
                console.log(msg);
                $.ajax({
                    type: 'POST',
                    url: 'contact.php',
                    data: msg,
                    success: function (data) {
                        $('#results').html(data);
                    },
                    error: function (xhr, str) {
                        alert('Возникла ошибка: ' + xhr.responseCode);
                    }
                });
            }
        });
    });
    console.log();
})();

//# sourceMappingURL=common.js.map