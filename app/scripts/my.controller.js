(function () {
  'use strict';
  function MyController() {
    const self = this;
    self.firstName = '';
    self.lastName = '';
    self.getFullName = () => {
      return self.firstName + self.lastName;
    };
  }
  angular.module('divesites')
  .controller('MyController', [MyController]);
})();
