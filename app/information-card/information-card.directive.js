(function() {
  'use strict';

  function informationCard() {
    return {
      controller: 'InformationCardController',
      controllerAs: 'vm',
      link,
      templateUrl: 'information-card/information-card.template.html',
    };

    function link(scope, element) {
      // If the site is a divesite, then activate the dive tab;
      // if not, then activate the comments tab. This behaves a bit
      // weirdly because at the time the directive is linked, ng-if
      // hasn't yet resolved, so ng-if DOM elements aren't in the DOm
      // and consequently jQuery can't access the tab by ID; that's
      // why we use ng-show instead.
      let selector;
      if (scope.vm.site.type === 'divesite') {
        console.log('there is a dive list');
        selector = '#js-dive-list-tab';
      } else {
        console.log('no dive list');
        selector = '#js-comment-list-tab';
      }

      $(selector).tab('show');

      // Clean up
      element.on('$destroy', () => {
        // Because we created this scope manually, we need to destroy it
        // manually too
        scope.$destroy();
      });
    }
  }

  informationCard.$inject = [
  ];
  angular.module('divesites.informationCard').directive('informationCard', informationCard);
})();
