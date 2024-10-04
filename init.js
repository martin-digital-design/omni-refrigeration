(() => {
    console.log('Package running... | Martin Digital :)');

    const navbar_menu = $('#navbar_menu'),
        navbar = $('#navbar');

    navbar_menu.length > 0
        ? handleMobileNav(navbar_menu)
        : console.error('navbar-menu not found');

    navbar.length > 0
        ? handleNavPosition(navbar)
        : console.error('navbar not found');
})();

function handleMobileNav(navbar_menu) {
    let open = false;

    navbar_menu.on('click', () => {
        if (open) {
            $('body').css('overflow', 'visible');
        } else {
            $('body').css('overflow', 'hidden');
        }

        open = !open;
    });
}

function handleNavPosition(navbar) {
    const navbar_top = navbar.offset().top;
    const navbar_bottom = navbar_top + navbar.outerHeight();
    let viewport_top = 0;
    let ticking = false;

    $(document).on('scroll', () => {
        viewport_top = $(window).scrollTop();

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(viewport_top);
                ticking = false;
            });

            ticking = true;
        }
    });

    function handleScroll(viewport_top) {
        if (viewport_top > navbar_bottom) {
            navbar.addClass('floating-nav');
        } else {
            navbar.removeClass('floating-nav');
        }
    }
}
