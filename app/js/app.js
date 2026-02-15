/**
  * headerFixed
  * mobileNav
  * eventLoad
  * ajaxContactForm
  * alertBox
  * tabs
  * tabs2
  * goTop
  * AOS
  * flatAccordion
  * flatAccordions2
  * popupVideo
  * dropdown
  * no_link
  * flatCounter
  * ButtonSlide
  * parallax
  * loadmore
  * Preloader
*/

; (function ($) {
    "use strict";

    var isMobile = {
        Android: function () {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
          return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows()
          );
        },
      };

    var themesflatTheme = {

        // Main init function
        init: function () {
            this.config();
            this.events();
        },

        // Define vars for caching
        config: function () {
            this.config = {
                $window: $(window),
                $document: $(document),
            };
        },

        // Events
        events: function () {
            var self = this;

            // Run on document ready
            self.config.$document.on('ready', function () {


                // Retina Logos
                self.retinaLogo();


            });

            // Run on Window Load
            self.config.$window.on('load', function () {

            });
        },


        // Retina Logos
        retinaLogo: function () {
            var retina = window.devicePixelRatio > 1 ? true : false;
            var $logo = $('#site-logo img');
            var $logo2 = $('#logo-footer img');
            var $logo_retina = $logo.data('retina');

            if (retina && $logo_retina) {
                $logo.attr({
                    src: $logo.data('retina'),
                    width: $logo.data('width'),
                    height: $logo.data('height')
                });
            }
            if (retina && $logo_retina) {
                $logo2.attr({
                    src: $logo.data('retina'),
                    width: $logo.data('width'),
                    height: $logo.data('height')
                });
            }
            },
    }; // end themesflatTheme

    // Start things up
    themesflatTheme.init();

    var ajaxContactForm = function () {
        $('#contactform,#commentform').each(function () {
            $(this).validate({
                submitHandler: function (form) {
                    var $form = $(form),
                        str = $form.serialize(),
                        loading = $('<div />', { 'class': 'loading' });

                    $.ajax({
                        type: "POST",
                        url: $form.attr('action'),
                        data: str,
                        beforeSend: function () {
                            $form.find('.form-submit,comment-form').append(loading);
                        },
                        success: function (msg) {
                            var result, cls;
                            if (msg === 'Success') {
                                result = 'Message Sent Successfully To Email Administrator. ( You can change the email management a very easy way to get the message of customers in the user manual )';
                                cls = 'msg-success';
                            } else {
                                result = 'Error sending email.';
                                cls = 'msg-error';
                            }

                            $form.prepend(
                                $('<div />', {
                                    'class': 'flat-alert ' + cls,
                                    'text': result
                                }).append(
                                    $('<a class="close" href="#"><i class="fa fa-close"></i></a>')
                                )
                            );

                            $form.find(':input').not('.submit').val('');
                        },
                        complete: function (xhr, status, error_thrown) {
                            $form.find('.loading').remove();
                        }
                    });
                }
            });
        }); // each contactform
    };


    // Header Fixed
    var headerFixed = function () {
        if ($('body').hasClass('header-fixed')) {
            var nav = $('#header_main');
            if (nav.length) {
                var offsetTop = nav.offset().top,
                injectSpace = $('<div />', {
                }).insertAfter(nav);
                $(window).on('load scroll', function () {
                    if ($(window).scrollTop() > 200) {
                        nav.addClass('is-fixed');
                        injectSpace.show();
                    } else {
                        nav.removeClass('is-fixed');
                        injectSpace.hide();
                    }

                    if ($(window).scrollTop() > 300) {
                        nav.addClass('is-small');
                    } else {
                        nav.removeClass('is-small');
                    }
                })
            }
        }
    };

    // Mobile Navigation
    var mobileNav = function () {
        var mobile = window.matchMedia("(max-width: 991px)");
        var wrapMenu = $("#site-header-inner");
        var navExtw = $(".nav-extend.active");
        var navExt = $(".nav-extend.active").children();
    
        responsivemenu(mobile);
    
        mobile.addListener(responsivemenu);
    
        function responsivemenu(mobile) {
          if (mobile.matches) {
            $("#main-nav")
              .attr("id", "main-nav-mobi")
              .appendTo("#header_main")
              .hide()
              .children(".menu")
              .append(navExt)
              .find("li:has(ul)")
              .children("ul")
              .removeAttr("style")
              .hide()
              .before('<span class="arrow"></span>');
          } else {
            $("#main-nav-mobi")
              .attr("id", "main-nav")
              .removeAttr("style")
              .prependTo(wrapMenu)
              .find(".ext")
              .appendTo(navExtw)
              .parent()
              .siblings("#main-nav")
              .find(".sub-menu")
              .removeAttr("style")
              .prev()
              .remove();
    
            $(".mobile-button").removeClass("active");
            $(".sub-menu").css({ display: "block" });
          }
        }
        $(document).on("click", ".mobile-button", function () {
          $(this).toggleClass("active");
          $("#main-nav-mobi").slideToggle();
        });
        $(document).on("click", "#main-nav-mobi .arrow", function () {
          $(this).toggleClass("active").next().slideToggle();
        });
      };

    var ajaxSubscribe = {
        obj: {
            subscribeEmail: $('#subscribe-email'),
            subscribeButton: $('#subscribe-button'),
            subscribeMsg: $('#subscribe-msg'),
            subscribeContent: $("#subscribe-content"),
            dataMailchimp: $('#subscribe-form').attr('data-mailchimp'),
            success_message: '<div class="notification_ok">Thank you for joining our mailing list! Please check your email for a confirmation link.</div>',
            failure_message: '<div class="notification_error">Error! <strong>There was a problem processing your submission.</strong></div>',
            noticeError: '<div class="notification_error">{msg}</div>',
            noticeInfo: '<div class="notification_error">{msg}</div>',
            basicAction: 'mail/subscribe.php',
            mailChimpAction: 'mail/subscribe-mailchimp.php'
        },

        eventLoad: function () {
            var objUse = ajaxSubscribe.obj;

            $(objUse.subscribeButton).on('click', function () {
                if (window.ajaxCalling) return;
                var isMailchimp = objUse.dataMailchimp === 'true';

                if (isMailchimp) {
                    ajaxSubscribe.ajaxCall(objUse.mailChimpAction);
                } else {
                    ajaxSubscribe.ajaxCall(objUse.basicAction);
                }
            });
        },

        ajaxCall: function (action) {
            window.ajaxCalling = true;
            var objUse = ajaxSubscribe.obj;
            var messageDiv = objUse.subscribeMsg.html('').hide();
            $.ajax({
                url: action,
                type: 'POST',
                dataType: 'json',
                data: {
                    subscribeEmail: objUse.subscribeEmail.val()
                },
                success: function (responseData, textStatus, jqXHR) {
                    if (responseData.status) {
                        objUse.subscribeContent.fadeOut(500, function () {
                            messageDiv.html(objUse.success_message).fadeIn(500);
                        });
                    } else {
                        switch (responseData.msg) {
                            case "email-required":
                                messageDiv.html(objUse.noticeError.replace('{msg}', 'Error! <strong>Email is required.</strong>'));
                                break;
                            case "email-err":
                                messageDiv.html(objUse.noticeError.replace('{msg}', 'Error! <strong>Email invalid.</strong>'));
                                break;
                            case "duplicate":
                                messageDiv.html(objUse.noticeError.replace('{msg}', 'Error! <strong>Email is duplicate.</strong>'));
                                break;
                            case "filewrite":
                                messageDiv.html(objUse.noticeInfo.replace('{msg}', 'Error! <strong>Mail list file is open.</strong>'));
                                break;
                            case "undefined":
                                messageDiv.html(objUse.noticeInfo.replace('{msg}', 'Error! <strong>undefined error.</strong>'));
                                break;
                            case "api-error":
                                objUse.subscribeContent.fadeOut(500, function () {
                                    messageDiv.html(objUse.failure_message);
                                });
                        }
                        messageDiv.fadeIn(500);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Connection error');
                },
                complete: function (data) {
                    window.ajaxCalling = false;
                    alert('Thank you for joining our mailing list!');
                }
            });
        }
    };
    
    var alertBox = function () {
        $(document).on('click', '.close', function (e) {
            $(this).closest('.flat-alert').remove();
            e.preventDefault();
        })

    };

    var flatAccordion = function() {
        var args = {duration: 600};
        $('.flat-toggle .toggle-title.active').siblings('.toggle-content').show();
      
        $('.flat-toggle.enable .toggle-title').on('click', function() {
            $(this).closest('.flat-toggle').find('.toggle-content').slideToggle(args);
            $(this).toggleClass('active');
        }); // toggle 
      
        $('.flat-accordion .toggle-title').on('click', function () {
            $('.flat-accordion .flat-toggle').removeClass('active');
            $(this).closest('.flat-toggle').toggleClass('active');

            if( !$(this).is('.active') ) {
                $(this).closest('.flat-accordion').find('.toggle-title.active').toggleClass('active').next().slideToggle(args);
                $(this).toggleClass('active');
                $(this).next().slideToggle(args);
            } else {
                $(this).toggleClass('active');
                $(this).next().slideToggle(args);
                $('.flat-accordion .flat-toggle').removeClass('active');
            }     
        }); // accordion
    }; 

    var tabs = function(){
        $('.flat-tabs').each(function(){
            $(this).find('.content-tab').children().hide();
            $(this).find('.content-tab').children().first().show();
            $(this).find('.menu-tab').children('li').on('click',function(){
                var liActive = $(this).index();
                var contentActive=$(this).siblings().removeClass('active').parents('.flat-tabs').find('.content-tab').children().eq(liActive);
                contentActive.addClass('active').fadeIn("slow");
                contentActive.siblings().removeClass('active');
                $(this).addClass('active').parents('.flat-tabs').find('.content-tab').children().eq(liActive).siblings().hide();
            });
        });
    };

    var tabs2 = function(){
        $('.flat-tabs-style2').each(function(){
            $(this).find('.content-tab').children().hide();
            $(this).find('.content-tab').find('.content-inner.active').show();
            $(this).find('.menu-tab').children('li').on('click',function(){
                var liActive = $(this).index();
                console.log(liActive);
                var contentActive=$(this).siblings().removeClass('active').parents('.flat-tabs-style2').find('.content-tab').children().eq(liActive);
                contentActive.toggleClass('active').fadeIn("slow");
                contentActive.siblings().removeClass('active');
                $(this).addClass('active').parents('.flat-tabs-style2').find('.content-tab').children().eq(liActive).siblings().hide();
            });
            $(this).find('.content-tab').find('.content-inner').find('.btn-delete').on('click',function(){
                $('.content-tab').find('.content-inner').hide();
            });
        });
    };

    var goTop = function() {
    };

    var popupVideo = function () {
        if ($().magnificPopup) {
          $(".popup-youtube").magnificPopup({
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
          });
        }
      };
      var dropdown = function(id){
        var obj = $(id+'.dropdown');
        var btn = obj.find('.btn-selector');
        var dd = obj.find('ul');
        var opt = dd.find('li');
            opt.on("click", function() {
                // dd.hide();
                var txt = $(this).text();
                opt.removeClass("active");
                $(this).toggleClass("active");
                btn.text(txt);
            });
    };
    var no_link = function(){
        $('a.nolink').on('click', function(e){
          e.preventDefault();
      });
    }


    var flatCounter = function () {
        if ($(document.body).hasClass("counter-scroll")) {
          var a = 0;
          $(window).scroll(function () {
            var oTop = $(".box").offset().top - window.innerHeight;
            if (a == 0 && $(window).scrollTop() > oTop) {
              if ($().countTo) {
                $(".box")
                  .find(".number")
                  .each(function () {
                    var to = $(this).data("to"),
                      speed = $(this).data("speed");
    
                    $(this).countTo({
                      to: to,
                      speed: speed,
                    });
                  });
              }
              a = 1;
            }
          });
        }
    };

        var loadmore = function () {
        $(".fl-item").slice(0, 16).show();

        $(".loadmore").on("click", function(e){
          e.preventDefault();

          $(".fl-item:hidden").slice(0, 8).slideDown();
          if($(".fl-item:hidden").length == 0) {
            $(".loadmore").hide();
          }
        });
    };

    var ButtonSlide = function () {
        $('.btn-next-team,.btn-next').on('click', function () {
            $('.swiper-button-next').click();
        });
        $('.btn-prev-team,.btn-prev').on('click', function () {
            $('.swiper-button-prev').click();
        });
    };

    var parallax = function () {
        if ($().parallax && isMobile.any() == null) {
          $(".parallax").parallax("50%", 0.2);
        }
      };

      var flatAccordions2 = function() {
        var args = {easing:'easeOutExpo', duration:400};
        $('.widget.active').find('.content-widget').show();
        $('.widget-title').on('click', function () {
            if ( !$(this).parent().is('.active') ) {
                $(this).parent().toggleClass('active')
                    .children('.content-widget').slideToggle(args)
                    .children('.content-widget').slideToggle(args);
                    this.addClass('show');
            } else {
                $(this).parent().toggleClass('active');
                $(this).next().slideToggle(args);
            }
        });
    };

    var Preloader = function () {
        setTimeout(function () {
        $(".preload").fadeOut("slow", function () {
            $(this).remove();
        });
        }, 800);
    };
  
    // Dom Ready
      $(function () {
          headerFixed();
          mobileNav();
          ajaxSubscribe.eventLoad();
        ajaxContactForm();
        alertBox();
        tabs();
        tabs2();
        goTop();
        AOS.init();
        flatAccordion();
        flatAccordions2();
        popupVideo();
        dropdown('#artworks');
        dropdown('#category');
        no_link();
        flatCounter();
        // ButtonSlide();
        $(window).on("load resize", function () {
            parallax();
        });
          loadmore();
          Preloader();
          initTracksDashboard();
          initTeamGalleryToggle();
      });

  })(jQuery);



/* Tracks render logic content*/
  function initTracksDashboard() {
  const TRACK_DOC_LINK =
    "https://docs.google.com/document/d/1s_tQwY2wKMVUOfP0UWxWCdpEB03PZx9q/edit?usp=sharing&ouid=107506195031465198362&rtpof=true&sd=true";

  const tracksData = {
    t1: {
      name: "TRACK 1",
      tagline: "Education & Equality",
      overview:
        "Focuses on improving access to quality education and promoting equality across communities. Teams can explore solutions related to inclusive learning, accessibility, digital education, gender equality, and reducing social or economic disparities.",
      resourceTitle: "Status",
      resourceDesc: "Problem statements will be published soon."
      // linkText: "Open problem statements",
      // linkHref: TRACK_DOC_LINK
    },
    t2: {
      name: "TRACK 2",
      tagline: "Energy & Infrastructure",
      overview:
        "Addresses challenges in sustainable energy, resilient infrastructure, and smart cities. Projects may involve renewable energy, efficient transportation, green buildings, smart grids, and infrastructure innovation.",
      resourceTitle: "Status",
      resourceDesc: "Problem statements will be published soon."
      // linkText: "Open problem statements",
      // linkHref: TRACK_DOC_LINK
    },
    t3: {
      name: "TRACK 3",
      tagline: "Nutrition & Environment",
      overview:
        "Centers on food security, nutrition, and environmental sustainability. Teams can work on sustainable agriculture, climate-resilient food systems, waste reduction, and environmental protection.",
      resourceTitle: "Status",
      resourceDesc: "Problem statements will be published soon."
      // linkText: "Open problem statements",
      // linkHref: TRACK_DOC_LINK
    },
    t4: {
      name: "TRACK 4",
      tagline: "Create Your Own",
      overview:
        "An open innovation track where teams define their own problem statement, provided it aligns with the hackathon theme and the UN Sustainable Development Goals (SDGs).",
      resourceTitle: "Status",
      resourceDesc: "Bring your own problem statement."
      // linkText: "Open guidelines",
      // linkHref: "#"
    }
  };

  const buttons = document.querySelectorAll(".track-item");
  const panel = document.getElementById("detail-panel");
  const content = document.getElementById("panel-content");

  if (!buttons.length || !panel || !content) return;

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }

  function render(trackId) {
    const data = tracksData[trackId];
    if (!data) return;

    panel.classList.add("switching");

    setTimeout(() => {
      content.innerHTML = "";

      const title = createEl("h3", "track-name", data.name);
      const tagline = createEl("p", "track-tagline", data.tagline);

      const grid = createEl("div", "track-content-grid");
      const main = createEl("div", "col-main");
      const side = createEl("div", "col-side");

      const overviewLabel = createEl("span", "content-label", "Overview");
      const overviewText = createEl("p", "track-text", data.overview);
      main.appendChild(overviewLabel);
      main.appendChild(overviewText);

      const resourcesLabel = createEl("span", "content-label", "Resources");
      const ideas = createEl("div", "project-ideas");
      const ideaItem = createEl("p", "idea-item");
      const ideaTitle = createEl("span", "", data.resourceTitle);
      ideaItem.appendChild(ideaTitle);
      ideaItem.appendChild(document.createTextNode(` ${data.resourceDesc}`));
      ideas.appendChild(ideaItem);
      side.appendChild(resourcesLabel);
      side.appendChild(ideas);

      grid.appendChild(main);
      grid.appendChild(side);

      content.appendChild(title);
      content.appendChild(tagline);
      content.appendChild(grid);
      panel.classList.remove("switching");
    }, 220);
  }
/*  add this part if open problem statement is required to render function
<div class="cta-container">
  <a class="btn-outline small" href="${data.linkHref}" target="_blank" rel="noopener noreferrer">
    ${data.linkText}
  </a>
</div>
*/


    function setActiveTrack(id) {
      buttons.forEach(b => {
        const isActive = b.getAttribute("data-track") === id;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-track");
        if (!id) return;
        setActiveTrack(id);
        render(id);
      });
    });

    // Default load
    setActiveTrack("t1");
    render("t1");
  }

  function initTeamGalleryToggle() {
    const selector = document.getElementById("ghTeamYearSelector");
    if (!selector) return;

    const buttons = selector.querySelectorAll(".gh-team-year-btn");
    const galleries = document.querySelectorAll(".gh-team-gallery");
    if (!buttons.length || !galleries.length) return;

    function setActive(year) {
      buttons.forEach(btn => {
        const isActive = btn.dataset.year === year;
        btn.classList.toggle("is-active", isActive);
      });

      galleries.forEach(gallery => {
        const isActive = gallery.dataset.year === year;
        gallery.style.display = isActive ? "" : "none";
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => setActive(btn.dataset.year));
    });

    setActive("2024-2025");
  }

// =========================
// Project Archive (2024-2025)
// =========================
(() => {
  const root = document.getElementById("project-archive");
  if (!root) return;

  const DEVPOST_2025 = "https://george-hacks.devpost.com/project-gallery";

  const ARCHIVE = {
    2025: {
      viewAll: DEVPOST_2025,
      featured: [
        {
          award: "Winner",
          title: "Greenify",
          
          impact: "Greenify connects urban communities with real-life reforestation projects, making environmental impact accessible, social, and rewarding",
          link: "https://devpost.com/software/greenify-4imnrx"
        },
          {
          award: "Winner",
          title: "DigitalMedics",
          
          impact: "DigitalMedics is a fall-detection, button-derived emergency alert system that alerts 911 authorities and personal contacts through SMS text messages",
          link: "https://devpost.com/software/digitalmedics"
        },
        
        {
          award: "Winner",
          title: "WellNest",
          
          impact: "Unlocking Open Source for Global Health - Making SDG-Aligned Projects Discoverable.",
          link: "https://devpost.com/software/wellnest-yk4n6m"
        },
          {
          award: "Winner",
          title: "RootSync",
         
          impact: "AI-powered chatbot and IoT sensor system provide real-time soil data and smart crop rotation recommendations, improving yields, soil health, and farmer profits",
          link: "https://devpost.com/software/rootsync"
        },
         {
          award: "Winner",
          title: "Medical Wallet (Track 2)",
         
          impact: "Medical Wallet is a blockchain-powered platform that allows patients in underserved communities control over their medical records, ensuring medical professionals can access data securely and quickly",
          link: "https://devpost.com/software/medical-wallet-track-2",
          align: "center"
        }
      ]
    },
    2024: {
      viewAll: "./pages/projects-2024.html",
      featured: [
        {
          award: "Winner",
          title: "Blockchain Health Care",
          
          impact: "A blockchain-based healthcare platform that enables patients to securely store and share medical records with doctors across hospitals using consent-driven access control.",
          link: "assets/project_2024/Blockchain_Health_Care_MANVIRANKAWAT.pdf"
        },
        {
          award: "Runner-Up",
          title: "FDA Compliance Checker: Gene-Us",
          
          impact: "A compliance analysis tool that helps evaluate FDA-related healthcare data by improving transparency, accuracy, and regulatory awareness in medical workflows.",
          link: "assets/project_2024/FDAComplianceCheckerGeneUs_GabrielleBruce.pdf"
        }
      ]
    }
  };


 
  const yearBtns = root.querySelectorAll(".ghpa-year-btn");
  const featuredGrid = root.querySelector("#ghpaFeaturedGrid");
  const activeYearEls = root.querySelectorAll(".ghpa-active-year");
  const viewAllBtn = root.querySelector("#paViewAllBtn");

  let currentYear = 2025;

  function setActiveYear(year) {
    currentYear = year;

    yearBtns.forEach(btn =>
      btn.classList.toggle("is-active", Number(btn.dataset.year) === year)
    );

    activeYearEls.forEach(el => (el.textContent = String(year)));

    renderFeatured();
    updateCTA();
  }

  function updateCTA() {
    const data = ARCHIVE[currentYear];
    if (!data || !viewAllBtn) return;

    viewAllBtn.href = data.viewAll;
    viewAllBtn.textContent = `View All Projects (${currentYear})`;
  }

  function renderFeatured() {
    const data = ARCHIVE[currentYear];
    if (!data || !featuredGrid) return;

    featuredGrid.innerHTML = "";
    const frag = document.createDocumentFragment();

    data.featured.forEach(item => {
      const card = document.createElement("article");
      card.className = `ghpa-winner-card${item.award === "Runner-Up" ? " is-runner" : ""}`;
      if ((item.align || "").toLowerCase() === "center") {
        card.classList.add("is-center");
      }
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.dataset.link = item.link;

      if (item.team) {
        const team = document.createElement("span");
        team.className = "ghpa-team-name";
        team.textContent = item.team;
        card.appendChild(team);
      }

      const title = document.createElement("h3");
      title.className = "ghpa-winner-title";
      title.textContent = item.title || "";
      card.appendChild(title);

      const impact = document.createElement("p");
      impact.className = "ghpa-impact-line";
      impact.textContent = item.impact || "";
      card.appendChild(impact);

      const link = document.createElement("span");
      link.className = "ghpa-btn";
      link.textContent = "Open";
      card.appendChild(link);

      frag.appendChild(card);
    });

    featuredGrid.appendChild(frag);
  }

  root.addEventListener("click", (e) => {
    const card = e.target.closest(".ghpa-winner-card");
    if (!card || !card.dataset.link) return;

    window.open(card.dataset.link, "_blank", "noopener,noreferrer");
  });

  root.addEventListener("keydown", (e) => {
    const card = e.target.closest(".ghpa-winner-card");
    if (!card || !card.dataset.link) return;
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    window.open(card.dataset.link, "_blank", "noopener,noreferrer");
  });

  yearBtns.forEach(btn => {
    btn.addEventListener("click", () =>
      setActiveYear(Number(btn.dataset.year))
    );
  });


  setActiveYear(2025);
})();

