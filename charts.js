function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
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

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    console.log(sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedSampleID = sampleArray.filter(data => data.id == sample);
    console.log(selectedSampleID);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedSampleID[0];
    console.log(firstSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    console.log(otuIds);
    console.log(otuLabels);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(id => 'OTU' + id).reverse();
    console.log(yticks);

    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      marker: {
        color: 'indigo',
        width: 1
      },
      type: "bar"
      
      
    }];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Sampled</b>",
      yaxis: {
        tickmode: 'array',
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        yanchor: 'center',
        text: "Top 10 sample bacteria for selected test subject.",
        showarrow: false
      }]
     
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});
    
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Electric'

      }
    }];
    console.log(bubbleData);
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures per Sample</b>',
      showlegend: false,
      xaxis: {title: "OTU ID", automargin: true},
      yaxis: {automargin: true},
      hovermode: 'closest',
      text: "Bubble size reflects sample size."
      
    };
    console.log(bubbleLayout);
    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}); 
    
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_SelId = data.metadata.filter(data => data.id == sample);
    console.log(metadata_SelId);

        // Create a variable that holds the washing frequency.
        var washFreq = +metadata_SelId[0].wfreq;

        // 4. Create the trace for the gauge chart.
        var gaugeData = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: {
                range: [null, 10],
                tickmode: "array",
                tickvals: [0,2,4,6,8,10],
                ticktext: [0,2,4,6,8,10]
              },
              bar: {color: "black"},
              steps: [
                { range: [0, 2], color: "gold" },
                { range: [2, 4], color: "peru" },
                { range: [4, 6], color: "firebrick" },
                { range: [6, 8], color: "darkorchid" },
                { range: [8, 10], color: "indigo" }]
            }
   }
 ]; 

 // Create the layout for the gauge chart.
 var gaugeLayout = { 
  autosize: true,
  annotations: [{
    xref: 'paper',
    yref: 'paper',
    x: 0.5,
    xanchor: 'center',
    y: 0,
    yanchor: 'center',
    text: "Washing frequency per week for test subject.",
    showarrow: false
    }]
  };
  // Use Plotly to plot the gauge data and layout.
 Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  
  });
}
