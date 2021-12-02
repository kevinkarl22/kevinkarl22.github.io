$(function() {
  let pages = ['home', 'my-works', 'products', 'certifications'];
  let currentPage = window.location.hash.replace('#', '');

  let mainWindow = $(window);
  let mainBody = $('body');
  let mainContent = $('#main-body #main-content');

  let navLink = $('#main-body .nav-link');
  let navLinkDefault = $('#main-body .nav-link[href="#home"]');

  function validatePage() {
    let loadingScreen = showLoadingScreen();

    if ($.inArray(currentPage, pages) == -1) {
      navLinkDefault.get(0).click();
    } else {
      setActiveMenu(function() {
        loadPageBackgroundAndContent();
      });
    }

    setTimeout(function() {
      hideLoadingScreen(loadingScreen);
    }, 500);
  }

  function showLoadingScreen() {
    mainBody.prepend('<div id="loading-screen"><div id="loading-screen-icon"></div></div>');
    mainWindow.scrollTop(0);

    return $('#loading-screen');
  }

  function hideLoadingScreen(loadingScreen) {
    loadingScreen.remove();
  }

  function setActiveMenu(callbackAction) {
    let navLinkActive = $('#main-body .nav-link.active');

    navLinkActive.removeClass('active');
    navLink.each(function() {
      if ($(this).attr('href').replace('#', '') == currentPage) {
        $(this).attr('aria-current', 'page').addClass('active');
      }
    });

    callbackAction();
  }

  function loadPageBackgroundAndContent() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let binaryText = textToBinary('Kevin Karl Leaño').split("");
    let binaryTextSize = 40;
    let binaryFlow = [];

    $(canvas).appendTo('body');

    canvas.height = mainWindow.height();
    canvas.width = mainWindow.width();

    for (let index = 0; index < $(canvas).width() / binaryTextSize; index++) {
      binaryFlow[index] = 0;
    }

    setInterval(function() {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, $(canvas).width(), $(canvas).height());
      context.fillStyle = 'rgba(255, 255, 255, 0.05)';
      context.font = binaryTextSize + 'px arial';

      for (let index = 0; index < binaryFlow.length; index++) {
        context.fillText(binaryText[Math.floor(Math.random() * binaryText.length)], index * binaryTextSize, binaryFlow[index] * binaryTextSize);

        if (binaryFlow[index] * binaryTextSize > $(canvas).height() && Math.random() > 0.9) {
          binaryFlow[index] = 0;
        }

        binaryFlow[index]++;
      }
    }, 60);

    mainWindow.on('resize', function() {
      canvas.height = mainWindow.height();
      canvas.width = mainWindow.width();
    });

    $.ajax({
        url: '/resources/pages/' + currentPage + '.html',
        type: 'GET',
      })
      .done(function(data) {
        mainContent.html(data);

        switch (currentPage) {
          case 'home':
            break;
          case 'my-works':
            break;
          case 'products':
            break;
          default:
        }
      });
  }

  function textToBinary(text) {
    let binaryText = '';

    for (let index = 0; index < text.length; index++) {
      binaryText += text[index].charCodeAt(0).toString(2) + ' ';
    }

    return binaryText;
  }

  mainWindow.on('hashchange', function() {
    currentPage = window.location.hash.replace('#', '');

    validatePage();
  });

  validatePage();
});