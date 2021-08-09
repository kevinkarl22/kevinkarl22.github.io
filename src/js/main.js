$(function() {
  var pages = ['home', 'features', 'products'];
  var currentPage = window.location.hash.replace('#', '');

  var navLink = $('#main-body .nav-link');
  var navItem = $('#main-body .nav-link[href="#home"]');
  var mainContent = $('#main-body #main-content');

  function setActiveMenu() {
    var navLinkActive = $('#main-body .nav-link.active');

    navLinkActive.removeClass('active');

    navLink.each(function() {
      if ($(this).attr('href').replace('#', '') == currentPage) {
        $(this).attr('aria-current', 'page').addClass('active');
      }
    });
  }

  function loadPage() {
    $.ajax({
        url: '/resources/pages/' + currentPage + '.html',
        type: 'GET',
      })
      .done(function(data) {
        mainContent.html(data);

        switch (currentPage) {
          case 'home':
            break;
          default:
        }
      });
  }

  $(window).on('hashchange', function() {
    currentPage = window.location.hash.replace('#', '');

    if ($.inArray(currentPage, pages) == -1) {
      navItem.get(0).click();
    } else {
      setActiveMenu();
      loadPage();
    }
  });

  if (currentPage == '') {
    navItem.get(0).click()
  } else {
    setActiveMenu();
    loadPage();
  }
});