(function () {
  'use strict';
  function InformationCardChartsService($document) {
    return {
      createHistogram,
    };
    function createHistogram(name, values, ticks=20, width=512, height=200, xMin=undefined, xMax=undefined) {
      const formatCount = d3.format('');

      let _xMax = xMax;
      let _xMin = xMin;
      if (xMin === undefined) {
        _xMin = 0;
      }
      if (xMax === undefined) {
        _xMax = d3.max(values);
      } 

      // x scale
      const x = d3.scale.linear()
      .domain([_xMin, _xMax])
      .range([0, width]);

      // Histogram data
      const data = d3.layout.histogram()
      .bins(x.ticks(ticks))
      (values);

      // Y scale
      const y = d3.scale.linear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height, 0]);

      // X axis
      const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

      const svgID = `information-card-${name}-histogram`;
      const svg = d3.select($document[0].createElement('div'))
      .append('svg')
      .attr('id', svgID)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width + 20} ${height + 20}`)
      .classed('svg-content-responsive', true);

      const g = svg
      .append('g')
      .attr('transform', 'translate(10, 0)');

      const bar = g.selectAll('.bar')
      .data(data).enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', d => `translate(${x(d.x)}, ${y(d.y)})`);

      bar.append('rect')
      .attr('x', 1)
      .attr('width', x(data[0].dx) - 2)
      .attr('height', d => height - y(d.y));

      g.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

      return svg.node();
    }
  }

  InformationCardChartsService.$inject = ['$document'];
  angular.module('divesites.informationCard').factory('informationCardChartsService', InformationCardChartsService);

})();
