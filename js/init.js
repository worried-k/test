/*
	Strata by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var settings = {

        // Parallax background effect?
        parallax: true,

        // Parallax factor (lower = more intense, higher = less intense).
        parallaxFactor: 20

    };

    skel.init({
        reset: 'full',
        containers: '100%',
        breakpoints: {
            global: {
                href: '/css/style.css',
                grid: {
                    gutters: ['2.5em', 0]
                }
            },
            xlarge: {
                media: '(max-width: 1800px)',
                href: '/css/style-xlarge.css'
            },
            large: {
                media: '(max-width: 1280px)',
                href: '/css/style-large.css',
                grid: {
                    gutters: ['2em', 0]
                }
            },
            medium: {
                media: '(max-width: 980px)',
                href: '/css/style-medium.css'
            },
            small: {
                media: '(max-width: 736px)',
                href: '/css/style-small.css',
                grid: {
                    gutters: ['1.5em', 0],
                    zoom: 2
                },
                viewport: {
                    scalable: false
                }
            },
            xsmall: {
                media: '(max-width: 480px)',
                href: '/css/style-xsmall.css',
                grid: {
                    zoom: 3
                }
            }
        }
    });

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $header = $('#header');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            $body.removeClass('is-loading');
        });

        // Touch?
        if (skel.vars.isMobile) {

            // Turn on touch mode.
            $body.addClass('is-touch');

            // Height fix (mostly for iOS).
            window.setTimeout(function() {
                $window.scrollTop($window.scrollTop() + 1);
            }, 0);

        }

        // Header.

        // Parallax background.

        // Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
        if (skel.vars.browser == 'ie' ||
            skel.vars.isMobile)
            settings.parallax = false;

        if (settings.parallax) {

            skel.change(function() {

                if (skel.isActive('medium')) {

                    $window.off('scroll.strata_parallax');
                    $header.css('background-position', 'top left, center center');

                } else {

                    $header.css('background-position', 'left 0px');

                    $window.on('scroll.strata_parallax', function() {
                        $header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
                    });

                }

            });

        }

    });

})(jQuery);