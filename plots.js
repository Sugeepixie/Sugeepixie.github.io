function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  }

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
  // Demographics
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      //PANEL.append("h6").text(result.location);
      Object.entries(result).forEach(([key, value]) => {
    PANEL.append("h6").text(`${key}: ${value}`);
      });
    });
  }

  //Deliverable 1
    // 1. Create the buildCharts function.
    function buildCharts(sample) {
   // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
   // 3. Create a variable that holds the samples array. 
    var  samples = data.samples;
    
   // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObject => sampleObject.id == sample);

  // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
    
   //  5. Create a variable that holds the first sample in the array.
     var result = filteredSamples[0];

    //Create a variable that holds the first sample in the metadata array.
     var gaugeResult = gaugeArray[0];
    
   // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
     var otu_ids = result.otu_ids;
     var otu_labels = result.otu_labels;
     var sample_values = result.sample_values;
//  Create a variable that holds the washing frequency.
    var wfreqs = gaugeResult.wfreq;
    console.log(wfreqs)

     // 7. Create the yticks for the bar chart.
     // Hint: Get the the top 10 otu_ids and map them in descending order  
     //  so the otu_ids with the most bacteria are last. 

     var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
  
        //console.log(yData)

    // 8. Create the trace for the bar chart. 
     var barTrace = {
       x:sample_values.slice(0,10).reverse(),
       y:yticks,
       text:otu_labels.slice(0,10).reverse(),
       type:"bar",
       orientation:"h"
     };
     
     var barData = [barTrace];

     // 9. Create the layout for the bar chart. 
     var barLayout = {

      title: "Top 10 BBacteria Cultures Found",
      margin: { t: 10, l: 150 }

     };
     // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

  //Deliverable 2 
   //1. Create the trace for the bubble chart.
   var bubbleTrace= {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
       size: sample_values,
       color: otu_ids,
        colorscale: "Portland" 
     }
  };
  var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
  };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
   
//Deliverable 3 
 
  // 4. Create the trace for the gauge chart.
    var gaugeTrace = {
      value: wfreqs,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},
        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ]
      }
    };
    var gaugeData = [gaugeTrace];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
  }
  // Initialize the dashboard
  init();