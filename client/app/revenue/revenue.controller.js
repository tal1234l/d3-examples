'use strict';

angular.module('portfolioApp')
  .controller('RevenueCtrl', function ($scope) {
    $scope.message = 'Hello';

    function type(d){
      var format = d3.time.format("%m/%Y");
      var tempDate = format.parse(d.month)
      //d.Month = tempDate.getMonth() + '/' + tempDate.getFullYear();
      d.Month = tempDate;
      d.branch_id = +d.branch_id;
      d.Total_Revenue_from_AppCard_Transactions  = +d.Total_Revenue_from_AppCard_Transactions;
      d.Total_Revenue_from_Non_AppCard_Transactions = +d.Total_Revenue_from_Non_AppCard_Transactions;
      return d;
    }

    d3.csv("sampledata.csv", type, function(data) {
      var ndx = crossfilter(data);
      var all = ndx.groupAll();
      var entriesCount = all.reduceCount().value();

      // dimensions (x axis)
      var appCardRevenue_Dim = ndx.dimension(function (d) {
        return d.Total_Revenue_from_AppCard_Transactions;
      });

      var nonAppCardRevenue_Dim = ndx.dimension(function (d) {
        return d.Total_Revenue_from_Non_AppCard_Transactions;
      });

      var branch_Dim = ndx.dimension(function (d) {
        return d.branch_id;
      });

      var Month_Dim = ndx.dimension(function (d) {
        return d.Month;
      });

      // get all branch id's
      var allBranches = branch_Dim.group();
      var branchIdArray = [];
      allBranches.all().forEach(function(branchId) {
        branchIdArray.push(""+branchId.key);
        $("#select-dropDown").append('<option value=' + branchId.key + '>' + branchId.key + '</option>');
      });

      // groups
      var sum_revenue_appCard = Month_Dim.group().reduceSum(function(d) {
        return d.Total_Revenue_from_AppCard_Transactions;
      });

      var sum_revenue_non_appCard = Month_Dim.group().reduceSum(function(d) {
        return d.Total_Revenue_from_Non_AppCard_Transactions;
      });

      // Range definition
      var dateRange = d3.extent(data, function (d) { return d.Month; });
      var maxDate = dateRange[1];
      var minDate = dateRange[0];

      // add more space on the x axes.
      maxDate.setMonth(maxDate.getMonth()+3);

      // create a composition chart
      var combined = dc.compositeChart('#revenue_chart')
        .width(900)
        .height(480)
        .title(function(d) {return 'Date: ' + (d.key.getMonth()+1) + '/' + d.key.getFullYear() + '\nValue: ' + d.value.toFixed(2); })
        .legend(dc.legend().x(750).y(420).gap(5))
        .brushOn(false)
        .elasticY(true)
        .dimension(Month_Dim)
        //.group(totalGroup)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xUnits(function (d) { return 20})
        .xAxisLabel('Month')
        .yAxisLabel('Revenue')
        .renderHorizontalGridLines(true)
        .margins({top: 10, right: 20, bottom: 100, left: 80});

      combined.xAxis().tickFormat(function (d) {
        return (d.getMonth()+1) + "/" + d.getFullYear();
      });
      combined.yAxis().tickFormat(function(d, i){
        return "$"+d;
      });

      // Revenue from non appcard users
      var nonAppCardRev = dc.barChart(combined)
        .colors("#FFC323")
        .centerBar(true)
        .barPadding(3)
        .group(sum_revenue_non_appCard, "Non AppCard");

      // Revenue from appcard users
      var appCardRev = dc.barChart(combined)
        .colors("#9900ff")
        .centerBar(true)
        .barPadding(3)
        .group(sum_revenue_appCard, "AppCard");

      combined.compose([nonAppCardRev, appCardRev]);

      /* ---Pie Chart---- */
      var PieChart =  function () {
        this.getTotalAppCardRevenue = function () {
          return Month_Dim.groupAll().reduceSum(function(d) {
            return d.Total_Revenue_from_AppCard_Transactions;
          }).value();
        };

        this.getTotalNonAppCradRevenue = function() {
          return Month_Dim.groupAll().reduceSum(function(d) {
            return d.Total_Revenue_from_Non_AppCard_Transactions;
          }).value();
        };

        this.getTotalRevenue = function () {
          return Month_Dim.groupAll().reduceSum(function(d) {
            return d.Total_Revenue_from_Non_AppCard_Transactions + d.Total_Revenue_from_AppCard_Transactions;
          }).value();
        };

        this.totalRev = this.getTotalRevenue();

        this.revenue_Json = {
          "items": [
            {
              "revenue": (this.getTotalAppCardRevenue() * 100 / this.totalRev).toFixed(2),
              "type": "AppCard Member"
            },
            {
              "revenue": (this.getTotalNonAppCradRevenue() * 100 / this.totalRev).toFixed(2),
              "type": "Regular Shopper"
            }
          ]
        };

        this.pie_ndx = crossfilter(this.revenue_Json.items);

        this.pie_revenue_dim = this.pie_ndx.dimension(function (d) {
          return d.type;
        });

        this.pie_revenue_sum = this.pie_revenue_dim.group().reduceSum(function (d) {
          return d.revenue;
        });

        this.revenuePie = dc.pieChart('#revenue_pie')
          .width(350)
          .height(350)
          .title(function(d) { return d.key + ": " + d.value +"% Revenue"; })
          .colors(d3.scale.ordinal().range(["#9900ff", "#FFC323"]))
          .label(function(d) { return d.value + "%"; })
          .dimension(this.pie_revenue_dim)
          .group(this.pie_revenue_sum)
          .innerRadius(20);

        this.revenuePie.render();
      };
      /* ---------------- */

      var pieRevenueChart = new PieChart();

      // define the filer triggers
      d3.select('#select-dropDown').on('change', function(){
        branch_Dim.filter(this.value);
        $('#revenue_pie').children().remove()
        var pieRevenueChart = new PieChart();
        dc.redrawAll();
      });

      // showtime!
      dc.renderAll();

    });
  });
