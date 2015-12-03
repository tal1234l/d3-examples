'use strict';

angular.module('portfolioApp')
  .controller('PocCtrl', function ($scope) {
    $scope.message = 'Hello';

    var mapKey = {
      0: '12am',
      1: '1am',
      2: '2am',
      3: '3am',
      4: '4am',
      5: '5am',
      6: '6am',
      7: '7am',
      8: '8am',
      9: '9am',
      10: '10am',
      11: '11am',
      12: '12pm',
      13: '1pm',
      14: '2pm',
      15: '3pm',
      16: '4pm',
      17: '5pm',
      18: '6pm',
      19: '7pm',
      20: '8pm',
      21: '9pm',
      22: '10pm',
      23: '11pm'
    }
    var data = [
      {
        hour: 0,
        cash: 100
      },
      {
        hour: 5,
        cash: 10
      },
      {
        hour: 6,
        cash: 40
      },
      {
        hour: 6,
        cash: 40
      },
      {
        hour: 6,
        cash: 30
      },
      {
        hour: 18,
        cash: 70
      }
    ];
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    // dimenssion
    var cashDimension = ndx.dimension(function (d) {
      return d.hour;
    });

    //group
    var countCashDimension = cashDimension.group().reduceCount();

    //turn the array to key value object
    var countArray = {};
    countCashDimension.all().forEach(function(item) {
      countArray[item.key] = item.value;
    });

    var sumCashDimension = cashDimension.group().reduceSum(function(d) {
      var temp = d.cash / countArray[d.hour];
      return temp;
    });


    var pocChart  = dc.barChart('#bar-chart');

    pocChart
      .width(700)
      .height(280)
      .dimension(cashDimension)
      .group(sumCashDimension)
      .x(d3.scale.linear().domain([-1, 24]))
      .elasticY(true)
      .centerBar(true)
      .barPadding(1)
      .colors(["#FFC323"])
      .xAxisLabel('Time of day')
      .yAxisLabel('Transactions')
      .renderHorizontalGridLines(true)

      .margins({top: 10, right: 20, bottom: 50, left: 50});
      //pocChart.xAxis().tickValues([0, 1, 2, 3, 4, 5]);
      pocChart.xAxis().tickFormat(function(d, i){
        return mapKey[d];
      });
      pocChart.yAxis().tickFormat(function(d, i){
        return "$"+d;
      });

    // showtime!
    dc.renderAll();
  });
