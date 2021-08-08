$(function() {
  var pages = ['1', 'previewer-box', 'version', 'developer', 'report-a-bug'];
  var currentPage = window.location.hash.replace('#', '');

  var linkPreviewerNavLink = $('#link-previewer .nav-link');
  var linkPreviewerMainContent = $('#link-previewer #main-content');
  var linkPreviewerSidebarMenu = $('#link-previewer #sidebar-menu');
  var linkPreviewerNavItem = $('#link-previewer .nav-item a[href="#previewer-box"]');

  function setActiveMenu() {
    var linkPreviewerNavLinkActive = $('#link-previewer .nav-link.active');

    linkPreviewerNavLinkActive.removeClass('active');

    linkPreviewerNavLink.each(function() {
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
        linkPreviewerMainContent.html(data);

        switch (currentPage) {
          case 'previewer-box':
            var linkPreviewerEnablePreviewerBox = $('#link-previewer #enable-previewer-box');
            var linkPreviewerBoxSize = $('#link-previewer #box-size');
            var linkPreviewerBorderStyle = $('#link-previewer #border-style');
            var linkPreviewerShowLinkInfo = $('#link-previewer #show-link-info');
            var linkPreviewerSaveChangesButton = $('#link-previewer #save-changes-button');
            var linkPreviewerFormMessage = $('#link-previewer #form-message');

            chrome.storage.sync.get(({
              lpEnablePreviewerBox,
              lpBoxSize,
              lpBorderStyle,
              lpShowLinkInfo
            }) => {
              linkPreviewerEnablePreviewerBox.attr('checked', lpEnablePreviewerBox);
              linkPreviewerBoxSize.val(lpBoxSize);
              linkPreviewerBorderStyle.val(lpBorderStyle);
              linkPreviewerShowLinkInfo.attr('checked', lpShowLinkInfo);
            });

            linkPreviewerSaveChangesButton.on('click', function() {
              let lpEnablePreviewerBox = (linkPreviewerEnablePreviewerBox.is(':checked')) ? true : false;
              let lpBoxSize = linkPreviewerBoxSize.val();
              let lpBorderStyle = linkPreviewerBorderStyle.val();
              let lpShowLinkInfo = (linkPreviewerShowLinkInfo.is(':checked')) ? true : false;

              chrome.storage.sync.set({
                lpEnablePreviewerBox,
                lpBoxSize,
                lpBorderStyle,
                lpShowLinkInfo
              });

              linkPreviewerFormMessage.html('<div class="alert alert-success alert-dismissible fade show" role="alert">Changes Successfully Saved.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');

              var linkPreviewerAlert = $('#link-previewer .alert');

              setTimeout(function() {
                linkPreviewerAlert.alert('close');
              }, 2000)
            });
            break;
          default:
        }
      });
  }

  $(window).on('hashchange', function() {
    currentPage = window.location.hash.replace('#', '');

    if ($.inArray(currentPage, pages) == -1) {
      linkPreviewerNavItem.get(0).click();
    } else {
      setActiveMenu();
      loadPage();
    }
  });

  linkPreviewerNavLink.on('click', function() {
    linkPreviewerSidebarMenu.collapse('hide');
  });

  if (currentPage == '') {
    linkPreviewerNavItem.get(0).click()
  } else {
    setActiveMenu();
    loadPage();
  }
});