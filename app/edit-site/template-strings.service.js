(function() {
  'use strict';

  function templateStringsService() {
    const templateStrings = {
      title: {
        add: {
          compressor: 'Add a new compressor',
          divesite: 'Add a new divesite',
          slipway: 'Add a new slipway',
        },
        edit: {
          compressor: 'Edit this compressor',
          divesite: 'Edit this divesite',
          slipway: 'Edit this slipway',
        },
      },

      name: {
        label: {
          compressor: 'Compressor name',
          divesite: 'Divesite name',
          slipway: 'Slipway name',
        },
        helpBlock: {
          compressor: 'Give this compressor a name',
          divesite: 'Give this divesite a name',
          slipway: 'Give this slipway a name',
        },
      },

      description: {
        label: {
          compressor: 'Description',
          divesite: 'Description',
          slipway: 'Description',
        },
        helpBlock: {
          compressor: '(Optional) Describe this compressor',
          divesite: '(Optional) Describe this divesite',
          slipway: '(Optional) Describe this slipway',
        },
      },
    };

    return templateStrings;
  }
  
  templateStringsService.$inject = [
  ];
  angular.module('divesites.editSite').factory('templateStringsService', templateStringsService);
})();
