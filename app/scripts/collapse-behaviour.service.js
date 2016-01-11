(function () {
  'use strict';
  function collapseBehaviour() {
    return {
      toggleChevron: function (e) {
        console.log('toggling');
        console.log(this);
        $(this)
        .find('.collapse-header__chevron')
        .toggleClass('opened');
      },
    };
  }
  collapseBehaviour.$inject = [];
  angular.module('divesites').factory('collapseBehaviour', collapseBehaviour);
})();
