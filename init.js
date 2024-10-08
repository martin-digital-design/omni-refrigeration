(() => {
    console.log('Package running... | Martin Digital :)');

    const navbar_menu = $('#navbar-menu'),
        navbar = $('#navbar'),
        dropdowns = $('[faq="container"]'),
        inputs = $('[md-form-data="input"]'),
        slider_images = $('[md-slider="img"]'),
        wheel = $('.wheel');

    navbar_menu.length > 0
        ? handleMobileNav(navbar_menu)
        : console.error('navbar-menu not found');

    navbar.length > 0
        ? handleNavPosition(navbar)
        : console.error('navbar not found');

    dropdowns.length > 0
        ? handleDropdown(dropdowns)
        : console.error('Dropdowns not found');

    inputs.length > 0 ? handleInputs(inputs) : console.error('No inputs found');

    slider_images.length > 0
        ? handleSlider(slider_images)
        : console.error('No slider images found');

    wheel.length > 0 ? handleWheel() : console.error('.wheel not found');
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
    let floating = false;

    $(document).on('scroll', () => {
        viewport_top = $(window).scrollTop();
        handleScroll(viewport_top);
    });

    function handleScroll(viewport_top) {
        if (viewport_top > navbar_bottom) {
            if (!floating) {
                navbar.css('opacity', '0%');

                setTimeout(() => {
                    navbar.css('opacity', '100%');
                    navbar.addClass('floating-nav');
                    floating = true;
                }, 250);
            }
        } else {
            navbar.removeClass('floating-nav');
            floating = false;
        }
    }
}

function handleDropdown(dropdown_list) {
    //loop through each FAQ container
    //Get child nodes: faq=question
    //add click event to question
    //add faq-open classes to both elements on click

    $(window).on('load', setInitialHeight);
    $(window).on('resize', setInitialHeight);

    dropdown_list.each((index, faq_container) => {
        faq_container = $(faq_container);

        const dropdown_heading = faq_container
            .children('[dropdown="heading"]')
            .first();
        const dropdown_content = faq_container
            .children('[dropdown="content"]')
            .first();
        const dropdown_heading_height = dropdown_heading.height();
        const dropdown_content_height = dropdown_content.height();
        const dropdown_padding = $(window).width() > 478 ? 64 : 48;

        faq_question.on('click', () => {
            if (dropdown_heading.hasClass('faq-open')) {
                faq_container.css({
                    height: `${faq_question_height + dropdown_padding}px`,
                });
                setTimeout(() => {
                    faq_question.removeClass('faq-open');
                }, 250);
            } else {
                faq_container.css({
                    height: `${
                        faq_answer_height +
                        faq_container.outerHeight() +
                        dropdown_padding
                    }px`,
                });
                faq_question.addClass('faq-open');
            }
        });
    });

    function setInitialHeight() {
        dropdown_list.each((index, faq_container) => {
            faq_container = $(faq_container);

            const dropdown_heading = faq_container
                .children('[dropdown="heading"]')
                .first();
            const dropdown_heading_height = dropdown_heading.height();
            const dropdown_padding = $(window).width() > 478 ? 64 : 48;

            faq_container.css(
                'height',
                `${dropdown_heading_height + dropdown_padding}px`
            );
        });
    }
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
    $(slider_btns).each((index, element) => {
        $(element).on('click', event => {
            let clicked_btn = $(element);
            let slide_reference = parseInt(
                clicked_btn.attr('md-slide-ref'),
                10
            );

            if (slide_reference === current) {
                console.error('Same selection');
                return;
            }
            if (slide_reference === undefined || slide_reference === null) {
                console.error('Btn slide ref error');
                return;
            }

            console.log('Function running');

            //stop slider interval
            clearInterval(global_interval);

            //set all non current slides to hidden
            hideNonCurrentSlides(slide_reference);

            //remove current btn selection
            $(slider_btns[current]).removeClass('current');

            //show clicked slide and new btn selection
            showSlide(slides[slide_reference], slider_btns[slide_reference]);

            //set current to new slid ref
            current = slide_reference;

            //create new interval
            global_interval = newIntervalTransition();
        });
    });

    function newIntervalTransition() {
        return setInterval(() => {
            //Hide current slide
            hideSlide(slides[current], slider_btns[current]);

            current = (current + 1) % slides.length;

            //show new slide
            showSlide(slides[current], slider_btns[current]);
        }, 3000);
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

function handleWheel() {
    // gsap.registerPlugin(Draggable);

    let wheel = document.querySelector('.wheel'),
        images = gsap.utils.toArray('.wheel-card');

    function setup() {
        let radius = wheel.offsetWidth / 2,
            center = radius,
            slice = 360 / images.length,
            DEG2RAD = Math.PI / 180;
        gsap.set(images, {
            x: i => center + radius * Math.sin(i * slice * DEG2RAD),
            y: i => center - radius * Math.cos(i * slice * DEG2RAD),
            rotation: i => i * slice,
            xPercent: -50,
            yPercent: -50,
        });
    }

    setup();

    window.addEventListener('resize', setup);

    // Draggable.create(wheel, {
    //     allowContextMenu: true,
    //     type: 'rotation',
    //     trigger: wheel,
    //     inertia: true,
    //     snap: {
    //         rotation: gsap.utils.snap(360 / images.length),
    //     },
    // });

    gsap.to(wheel, {
        rotation: -360,
        ease: 'none',
        duration: 60,
        repeat: -1,
    });
}
