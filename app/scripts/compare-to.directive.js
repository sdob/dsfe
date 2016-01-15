(function () {
  'use strict';
  function compareTo() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=compareTo',
      },
      link: function (scope, element, attrs, ngModel) {
        ngModel.$validators.compareTo = (modelValue) => {
          return modelValue === scope.otherModelValue;
        };
        scope.$watch('otherModelValue', () => {
          ngModel.$validate();
        });
      },
    };
  }
  angular.module('divesites').directive('compareTo', compareTo);
})();
