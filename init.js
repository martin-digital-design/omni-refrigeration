(() => {
    console.log('Package running... | Martin Digital :)');

    const navbar_menu = $('#navbar-menu'),
        navbar = $('#navbar'),
        FAQs = $('[faq="container"]'),
        inputs = $('[md-form-data="input"]'),
        slider_images = $('[md-slider="img"]');

    navbar_menu.length > 0
        ? handleMobileNav(navbar_menu)
        : console.error('navbar-menu not found');

    navbar.length > 0
        ? handleNavPosition(navbar)
        : console.error('navbar not found');

    FAQs.length > 0 ? handleFAQ(FAQs) : console.error('FAQs not found');

    inputs.length > 0 ? handleInputs(inputs) : console.error('No inputs found');

    slider_images.length > 0
        ? handleSlider(slider_images)
        : console.error('No slider images found');
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

function handleSlider(slides) {
    let current = 0;
    let global_interval;

    //set all slides to hidden except from current slide
    hideNonCurrentSlides(current);

    //set up buttons
    const slider_btns = $('[md-slide-ref]');

    if (slider_btns.length !== slides.length) {
        console.error('Btns error');
        return;
    }

    //set up initial button
    $(slider_btns[current]).addClass('current');

    //set intial interval
    global_interval = newIntervalTransition();

    //once intial setup complete, add event btn event listeners
    $(slider_btns).on('click', e => {
        let clicked_btn = $(e.target);
        let slide_reference = clicked_btn.attr('md-slide-ref');

        console.log(clicked_btn);
        console.log(slide_reference);

        if (slide_reference === current) return;
        if (slide_reference === undefined || slide_reference === null) {
            console.error('Btn slide ref error');
            return;
        }

        //stop slider interval
        clearInterval(global_interval);

        // //set all non current slides to hidden
        // hideNonCurrentSlides(slide_reference);

        // //show clicked slide
        // showSlide(slides[slide_reference]);

        //set current to new slid ref

        current = slide_reference;

        //create new interval
        global_interval = newIntervalTransition();
    });

    function newIntervalTransition() {
        return setInterval(() => {
            //Hide current slide
            hideSlide(slides[current], slider_btns[current]);

            current = (current + 1) % slides.length;

            //show new slide
            showSlide(slides[current], slider_btns[current]);
        }, 5000);
    }

    function hideNonCurrentSlides(current_slide_ref) {
        const non_current_slides = slides.filter(
            (index, element) => index != current_slide_ref
        );

        $(non_current_slides).css({ opacity: '0%' });
    }

    function showSlide(slide, button) {
        slide = $(slide);
        button = $(button);

        button.addClass('current');

        slide.css({ opacity: '100%' });
    }

    function hideSlide(slide, button) {
        slide = $(slide);
        button = $(button);

        button.removeClass('current');

        slide.css({ opacity: '0%' });
    }
}
