(() => {
    console.log('Package running... | Martin Digital :)');

    const navbar_menu = $('#navbar-menu'),
        navbar = $('#navbar'),
        dropdowns = $('[dropdown="container"]'),
        inputs = $('[md-form-data="input"]'),
        slider_containers = $('[md-slider="container"]'),
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

    slider_containers.length > 0
        ? handleSlider(slider_containers)
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
    //loop through each dropdown container
    //Get child nodes: dropdown=question
    //add click event to question
    //add dropdown-open classes to both elements on click

    $(window).on('load', setInitialHeight);

    let window_width = $(window).width();

    $(window).on('resize', () => {
        if (window_width != $(window).width()) {
            setInitialHeight();
        }
        window_width = $(window).width();
    });

    dropdown_list.each((index, dropdown_container) => {
        dropdown_container = $(dropdown_container);

        const dropdown_heading = dropdown_container
            .children('[dropdown="heading"]')
            .first();
        const dropdown_content = dropdown_container
            .children('[dropdown="content"]')
            .first();
        const dropdown_heading_height = dropdown_heading.height();
        const dropdown_content_height = dropdown_content.height();
        const dropdown_padding = $(window).width() > 478 ? 64 : 48;

        dropdown_heading.on('click', () => {
            if (dropdown_heading.hasClass('dropdown-open')) {
                dropdown_container.css({
                    height: `${dropdown_heading_height + dropdown_padding}px`,
                });
                setTimeout(() => {
                    dropdown_heading.removeClass('dropdown-open');
                }, 250);
            } else {
                dropdown_container.css({
                    height: `${
                        dropdown_content_height +
                        dropdown_container.outerHeight() +
                        dropdown_padding
                    }px`,
                });
                dropdown_heading.addClass('dropdown-open');
            }
        });
    });

    function setInitialHeight() {
        dropdown_list.each((index, dropdown_container) => {
            dropdown_container = $(dropdown_container);

            const dropdown_heading = dropdown_container
                .children('[dropdown="heading"]')
                .first();
            const dropdown_heading_height = dropdown_heading.height();
            const dropdown_padding = $(window).width() > 478 ? 64 : 48;

            dropdown_container.css(
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

function handleSlider(containers) {
    //get containers
    //Loop through container and get all images and buttons within the container (children)
    //repeat process below

    containers.each((index, container) => {
        container = $(container);
        //get images within container
        slider_slides = container.find('[md-slider="slide"]');
        //get buttons within container
        slider_buttons = container.find('[md-slide-ref]');

        //setup buttons
        if (slider_buttons.length !== slider_slides.length) {
            console.error('Btns error');
            return;
        }

        const current_slide_info = {
            current: 0,
            global_interval: null,
        };

        //set all slides to hidden except from current slide
        hideNonCurrentSlides(current_slide_info.current, slider_slides);

        //set up initial button
        $(slider_buttons[current_slide_info.current]).addClass('current');

        //set intial interval
        current_slide_info.global_interval = newIntervalTransition(
            slider_slides,
            slider_buttons,
            current_slide_info
        );

        //once intial setup complete, add event btn event listeners
        $(slider_buttons).each((index, button) => {
            $(button).on('click', event => {
                let clicked_btn = $(button);

                let slide_reference = parseInt(
                    clicked_btn.attr('md-slide-ref'),
                    10
                );

                if (slide_reference === current_slide_info.current) {
                    console.error('Same selection');
                    return;
                }
                if (slide_reference === undefined || slide_reference === null) {
                    console.error('Btn slide ref error');
                    return;
                }

                // stop slider interval
                clearInterval(current_slide_info.global_interval);

                //set all non current slides to hidden
                hideNonCurrentSlides(slide_reference, slider_slides);

                //remove current btn selection
                $(slider_buttons[current_slide_info.current]).removeClass(
                    'current'
                );

                //show clicked slide and new btn selection
                showSlide(
                    slider_slides[slide_reference],
                    slider_buttons[slide_reference]
                );

                //set current to new slid ref
                current_slide_info.current = slide_reference;

                //create new interval
                current_slide_info.global_interval = newIntervalTransition(
                    slider_slides,
                    slider_buttons,
                    current_slide_info
                );
            });
        });
    });

    function newIntervalTransition(
        slide_array,
        buttons_array,
        current_slide_info
    ) {
        return setInterval(() => {
            //Hide current slide
            hideSlide(
                slide_array[current_slide_info.current],
                buttons_array[current_slide_info.current]
            );

            //update current
            current_slide_info.current =
                (current_slide_info.current + 1) % slide_array.length;

            //show new slide
            showSlide(
                slide_array[current_slide_info.current],
                buttons_array[current_slide_info.current]
            );
        }, 3000);
    }

    function hideNonCurrentSlides(current_slide_ref, array) {
        const non_current_slides = array.filter(
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
