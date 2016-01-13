(function () {
  'use strict';
  function collapseBehaviour() {
    return {
      toggleChevron: function (e) {
        $(this)
        .find('.collapse-header__chevron')
        .toggleClass('opened');
      },
    };
  }
  collapseBehaviour.$inject = [];
  angular.module('divesites').factory('collapseBehaviour', collapseBehaviour);
})();
