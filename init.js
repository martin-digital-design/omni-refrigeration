(() => {
    console.log('Package running... | Martin Digital :)');

    const navbar_menu = $('#navbar_menu'),
        navbar = $('#navbar'),
        FAQs = $('[faq="container"]');

    navbar_menu.length > 0
        ? handleMobileNav(navbar_menu)
        : console.error('navbar-menu not found');

    navbar.length > 0
        ? handleNavPosition(navbar)
        : console.error('navbar not found');

    FAQs.length > 0 ? handleFAQ(FAQs) : console.error('FAQs not found');
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

function handleFAQ(FAQ_list) {
    //loop through each FAQ container
    //Get child nodes: faq=question
    //add click event to question
    //add faq-open classes to both elements on click

    FAQ_list.each((index, faq_container) => {
        const faq_question = faq_container.children('[faq="question"]').first();

        faq_question.on('click', () => {
            if (faq_container.hasClass('faq-open')) {
                faq_container.removeClass('faq-open');
                faq_question.removeClass('faq-open');
            } else {
                faq_container.addClass('faq-open');
                faq_question.addClass('faq-open');
            }
        });
    });
}
