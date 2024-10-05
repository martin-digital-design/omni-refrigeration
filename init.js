(() => {
    console.log('Package running... | Martin Digital :)');

    const navbar_menu = $('#navbar_menu'),
        navbar = $('#navbar'),
        FAQs = $('[faq="container"]');
    inputs = $('[md-form-data="input"]');

    navbar_menu.length > 0
        ? handleMobileNav(navbar_menu)
        : console.error('navbar-menu not found');

    navbar.length > 0
        ? handleNavPosition(navbar)
        : console.error('navbar not found');

    FAQs.length > 0 ? handleFAQ(FAQs) : console.error('FAQs not found');

    inputs.length > 0 ? handleInputs(inputs) : console.error('No inputs found');
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
        faq_container = $(faq_container);

        const faq_question = faq_container.children('[faq="question"]').first();
        const faq_answer = faq_container.children('[faq="answer"]').first();
        const faq_answer_height = faq_answer.height();
        const faq_question_height = faq_question.height();

        faq_container.css('height', `${faq_question_height + 64}px`);

        faq_question.on('click', () => {
            if (faq_question.hasClass('faq-open')) {
                faq_container.css({
                    height: `${faq_question_height + 64}px`,
                });
                setTimeout(() => {
                    faq_question.removeClass('faq-open');
                }, 250);
            } else {
                faq_container.css({
                    height: `${
                        faq_answer_height + faq_container.outerHeight() + 32
                    }px`,
                });
                faq_question.addClass('faq-open');
            }
        });
    });
}

function handleInputs(inputs) {
    $(window).on('load', () => {
        inputs.each((index, input) => {
            input = $(input);
            const label = input.siblings('label[md-form-data="label"]');

            if (input.val().length > 0) {
                shrinkInput(label);
            }

            input.on('focusin', () => {
                shrinkInput(label);
            });

            input.on('focusout', () => {
                if (input.val().length > 0) return;
                growInput(label);
            });
        });
    });

    function shrinkInput(label) {
        label.addClass('focussed');
    }

    function growInput(label) {
        label.removeClass('focussed');
    }
}
