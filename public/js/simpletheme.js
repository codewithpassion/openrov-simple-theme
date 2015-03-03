(function (window, $, undefined) {
  'use strict';

  var simpletheme;

  simpletheme = function simpletheme() {
    var self = this;
    console.log("Loading Simple Theme plugin in the browser.");

    var jsFileLocation = urlOfJsFile('simpletheme.js');

    this.name = 'simple-theme';   // for the settings
    this.viewName = 'Simple Theme'; // for the UI

    this.polymerTemplateFile = jsFileLocation + '../simple.html';
    this.template = "<rov-ui-simple class='simpleTheme'></rov-ui-simple>";

    this.loaded = function() {
      this.cockpit = window.cockpit;
      this.validTelemetry = "hdgd deap pitc roll yaw fthr servo starg fmem vout iout atmp cpuusage pres temp alps brdt sc1i sc2i sc3i brdi bt1i bt2i brdv avcc mtarg capa";
      this.telemetry = [];
      this.telemetryRAW = [];
      this.isInit = true;
      var panel = $('html /deep/ #rov_status_panel');
      panel.append('<div id="telemetry-graph" class="" ></div>');
      this.graphElement = panel.find('#telemetry-graph');

      self.listen()
    };
  };

  simpletheme.prototype.listen = function listen() {
    var rov = this;
    rov.cockpit.rov.on('status', function (data) {
      for (var i in data) {
        var li = i.toLowerCase();
        if(rov.validTelemetry.indexOf(li) != -1){
          rov.telemetry[li] = parseFloat(data[i]);
          rov.telemetryRAW[li] = (li == 'cpuusage'?parseFloat(data[i]).toFixed(2):data[i]);        
        }
      }
    
      if(rov.isInit){
        var runInit = false;
        for (var x in rov.telemetry) {
          if(rov.telemetry[x] != undefined){
            runInit = true;
            break;
          }
        }

        if(runInit){
          rov.init();
          rov.isInit = false;
        }
      }
    });

  };
  simpletheme.prototype.init = function() {
    var rov = this;
    var line = function(header){
      var t = -1;
      var n = 100;
      var v = 0;
      var data = [];

      function next () {
        var dataNow = rov.telemetry[header];
          return {
              time: ++t,
              value: v = (dataNow?dataNow:0)
          };
      }
       
      var width = n,
          height = 40;
     
      var x = d3.scale.linear()
          .domain([0, n - 1])
          .range([0, width]);
     
      var y = d3.scale.linear()
          .domain([0, 20])
          .range([height, 0]);
     
      var line = d3.svg.line()
          .x(function(d, i) { return x(d.time); })
          .y(function(d, i) { return y(d.value); });
      var main = d3.select($(rov.graphElement)[0]).append('div');

      var title = main
        .append('h1')
        .html(header);
      var status = main
        .append('span')
        .attr("class", 'status')
        .html(rov.telemetryRAW[header]);
      
      var svg = main.append("svg")
          .attr("width", width)
          .attr("height", height).attr("class", header);
      
      var path = svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);
        
        tick();
         
        function tick(){ 
            data.push(next());
            var maxList = [];
            data.forEach(function(d){maxList[maxList.length] = d.value});
        
            x.domain([t - n, t]);
            y.domain([d3.min(maxList),  d3.max(maxList)]);
      
            path
                .attr("d", line)
                .attr("transform", null)
                .transition()
                .duration(1000)
                .ease("linear")
                .attr("transform", "translate(-" + (width/n) + ")")
                .each("end", tick);
                console.log(header,rov.telemetryRAW,rov.telemetryRAW[header]);
            status.html(rov.telemetryRAW[header]);
            if(data.length > n){
              data.shift();  
            }
            
        } 
    }
    var validArr = rov.validTelemetry.split(" ");
    
    for(var x in validArr){
      new line(validArr[x]);
    }
  };

  //window.Cockpit.plugins.push(simpletheme);
  window.Cockpit.UIs.push(new simpletheme());

}(window, jQuery));
