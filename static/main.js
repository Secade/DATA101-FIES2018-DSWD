$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjYWRlIiwiYSI6ImNrcnU3cHVnNDNvZHQycHRqZnZnNzQxYXQifQ.F-OV6UiB-D5fepALN_4stA';

    var filterselect = $("#filterselect");
    var currentLevel = 'region';

    d3.json('/filters').then(function (data) {
        console.log(data)
        data.forEach(function (elem, i) {
            filterselect.append('<option value="' + elem['0'] + '">' + elem['0'] + '</option>');

        });
    });


    const bounds = [
        [105, -2], // Southwest coordinates
        [140, 28] // Northeast coordinates
    ];

    var map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/secade/ckt2o6v2f1l6017q9my3hm6a8', // style URL
        center: [122.22, 12.53], // starting position [lng, lat]
        zoom: 5, // starting zoom,
        minZoom: 5,
        maxZoom: 10,
        maxBounds: bounds
    });

    map.on('load', () => {

        map.on('click', function (e) {
            console.log(e);

            console.log(map.getCenter());
            console.log(map.getZoom());
        });

        map.addControl(new mapboxgl.NavigationControl());

        map.addSource('provinces', {
            type: 'vector',
            url: 'mapbox://secade.7dspyckj',
        });

        map.addSource('regions', {
            type: 'vector',
            url: 'mapbox://secade.6v2gs6xf',
        });

        map.addLayer({
            id: 'prov',
            type: 'fill',
            source: 'provinces',
            'source-layer': 'PHL_provinces-35svai',
            'minzoom': 7,
            paint: {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'NAME_1'],
                    0, '#ffffff',
                    11646, '#edf8fb',
                    174725666, '#ccece6',
                    349437485, '#99d8c9',
                    698863323, '#66c2a4',
                    873576243, '#41ae76',
                    1048289162, '#238b45',
                    1397715000, '#005824',
                ],
                'fill-outline-color': '#777777'
            }
        }, 'waterway-label');

        map.addLayer({
            id: 'reg',
             type: 'fill',
            source: 'regions',
            'source-layer': 'gadm36_PHL-49t1ot',
            'maxzoom': 7,
            paint: {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'REGION'],
                    0, '#ffffff',
                    11646, '#edf8fb',
                    174725666, '#ccece6',
                    349437485, '#99d8c9',
                    698863323, '#66c2a4',
                    873576243, '#41ae76',
                    1048289162, '#238b45',
                    1397715000, '#005824',
                ],
                'fill-outline-color': '#777777'
            }
        }, 'waterway-label');



        map.on('click', 'reg', (e) => {
            console.log(e.features[0]);
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("<b>" + e.features[0].properties['REGION'] + "</b>")
                .addTo(map);
        });

        map.on('click', 'prov', (e) => {
            console.log(e.features[0]);
            prov_name = e.features[0].properties['NAME_1']

            d3.json('/data/' + e.features[0].properties['NAME_1']).then(function (data) {
                console.log(data[0])

                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML("<b>" + prov_name + "</b><br><p>Respondents: " + data[0] + "</p>")
                    .addTo(map);
            });
        });

        map.on('zoom', () => {
            if (map.getZoom() > 7) {
            currentLevel = 'province'
            } else {
            currentLevel = 'region'
            }
            });


    });

    var w = 600;
    var h = 500;
    var padding_left = 100;
    var padding = 50;

    var bar = d3.select("#bar").append("svg")
        .attr("width", w)
        .attr("height", h);

    var maxRatio, regions,
        xScale, yScale,
        xAxis,
        yAxis;

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    d3.json('/filters/Meat').then(function (data) {
        data.sort(function(a,b) { return b.filter - a.filter;});

        if(currentLevel=='province'){
            data=data.slice(0,10);
        }

        maxRatio = d3.max(data, function (d) { return d.filter; });

        regions = data.map(function (d) { return eval("d."+currentLevel); });

        xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

        yScale = d3.scaleBand()
            .domain(regions)
            .rangeRound([padding, h - padding])
            .padding(0.1);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        bar.append("g")
            .attr("id", "xAxis")
            .attr("transform", "translate(" + (padding_left - padding) + "," + (h - padding) + ")")
            .call(xAxis);

        bar.append("g")
            .attr("id", "yAxis")
            .attr("transform", "translate(" + (padding_left) + ",0)")
            .call(yAxis);

        bar.append("text")
            .attr("id", "tableText")
            .attr("x", w / 2)
            .attr("y", h - padding + 40)
            .attr("text-anchor", "middle")
            .text(" Spending (Pesos)");

        bar.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", padding_left + 1)
            .attr("y", d => yScale(eval("d."+currentLevel)))
            .attr("width", 0)
            .attr("height", d => yScale.bandwidth())
            .style("fill", "darkblue")

    });

    $("#countryselect").on("change", () => {
        let val = $("#countryselect").val();

        ids = ['reg', 'prov']
        ids.forEach(id => {
            map.setPaintProperty(id, 'fill-color', "#ffffff")
        })
    });

    $("#filterselect").on("change", function (event) {
        // console.log(event);
        var selected_filter = $("#filterselect").val();

        var t = bar.transition()
            .duration(1000);

        //console.log(selected_country);
        d3.json('/filters/' + selected_filter).then(function (data) {
            data.sort(function(a,b) { return b.filter - a.filter;});

            if(currentLevel=='province'){
                data=data.slice(0,10);
            }

            maxRatio = d3.max(data, function (d) { return d.filter; });

            regions = data.map(function (d) { return eval("d."+currentLevel); });

            xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

            yScale = d3.scaleBand()
                .domain(regions)
                .rangeRound([padding, h - padding])
                .padding(0.1);

            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            bar.select("#xAxis")
                .call(function (update) {
                    update.transition(t)
                        .call(xAxis);
                });

            bar.select("#yAxis")
                .call(function (update) {
                    update.transition(t)
                        .call(yAxis);
                });

              bar.select("#tableText").text(selected_filter+" Spending (Pesos)");
              
            bar.selectAll("rect")
                .data(data)
                .join(function (enter) {
                    enter.append("rect")
                        .attr("x", padding_left + 1)
                        .attr("y", d => yScale(eval("d."+currentLevel)))
                        .attr("width", d => xScale(d.filter))
                        .attr("height", d => yScale.bandwidth())
                        .style("fill", "darkblue");
                }, function (update) {
                    update.call(function (update) {
                        update.transition(t)
                            .attr("width", d => xScale(d.filter))
                            .attr("height", d => yScale.bandwidth())
                            .style("fill", "darkblue");
                    })
                }, function (exit) {
                    exit.attr("fill", "#cccccc")
                        .call(function (exit) {
                            exit.transition(t)
                                .attr("width", d => xScale(0))
                                .attr("height", d => yScale(0))
                                .remove();
                        })
                }
                )
        });
    });
});