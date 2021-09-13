$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjYWRlIiwiYSI6ImNrcnU3cHVnNDNvZHQycHRqZnZnNzQxYXQifQ.F-OV6UiB-D5fepALN_4stA';

    const places = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'description': "Ilocos Region (Region I)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [120.37935631860842, 16.527463099750378]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Cagayan Valley (Region II)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [121.97776188987973, 17.20178227432727]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Central Luzon (Region III)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [120.79922741683328, 15.501969609212253]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "CALABARZON (Region IV-A)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [121.3348799407712, 14.447411988344953]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "MIMAROPA (Region IV-B)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [120.10969584465323, 11.970044681407131]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Bicol Region (Region V)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [123.38762585266443, 13.252093480110403]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Western Visayas (Region VI)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [122.5551356918998, 11.001271882053857]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Central Visayas (Region VII)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [123.8699535631905, 10.357340104047395]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Eastern Visayas (Region VIII)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [125.25758880423604, 12.048553199343928]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Zamboanga Peninsula (Region IX)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [122.64790972728474, 8.045970419159218]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Northern Mindanao (Region X)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [124.80718108176774, 8.676567624979455]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Davao Region (Region XI)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [126.18599291053351, 7.556255495468122]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "SOCCSKSARGEN (Region XII)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [124.78116576424401, 6.5493484992607875]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Caraga (Region XIII)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [126.10794695796227, 9.139193950313611]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Cordillera Administrative Region (CAR)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [121.09538712871114, 17.763691176317423]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Metropolitan Manila"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [121.05595258227856, 14.719805274469806]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'description': "Autonomous Region of Muslim Mindanao (ARMM)"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [124.1199438727179, 7.574497161577739]
                }
            }
        ]
    };

    var maxRatio, regions,
        xScale, yScale, t;
    var filterselect = $("#filterselect");
    var currentLevel = 'region';

    function updateChoroplethMap(fullData, currentLevel) {
        ids = { region: 'reg', province: 'prov' }
        get_field = { region: 'REGION', province: 'NAME_1' };

        colors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
        chunks = 9
        // bin filtered data into 9 chunks for choropleth map
        bin9chunks = d3.bin()
            .value(d => d.filter)
            .thresholds((data, min, max) =>
                d3.range(chunks).map(t => min + (t / chunks) * (max - min))
            )

        const matchExpression = ['match', ['get', get_field[currentLevel]]];
        // Calculate color values for each region
        bin9chunks(fullData).forEach((chunkGroup, i) => {
            chunkGroup.forEach((area) => {
                matchExpression.push(area[currentLevel], colors[i])
            })
        })
        matchExpression.push('#000000')
        map.setPaintProperty(ids[currentLevel], 'fill-color', matchExpression)
    }

    d3.json('/filters').then(function (data) {
        data.forEach(function (elem, i) {
            filterselect.append('<option value="' + elem['0'] + '">' + elem['0'] + '</option>');
        });
    });

    const bounds = [
        [105, -2], // Southwest coordinates
        [140, 28] // Northeast coordinates
    ];

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/secade/cktgt3viq1nn618qt9qx24itp',
        center: [122.22, 12.53],
        zoom: 5,
        minZoom: 5,
        maxZoom: 10,
        maxBounds: bounds
    });

    map.on('load', () => {

        map.on('click', function (e) {
            console.log(e);
            console.log(map.getCenter());
            console.log(map.getZoom());
            console.log(e.lngLat)
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
                'fill-color': '#b71c1c'
                // [
                //     'interpolate',
                //     ['linear'],
                //     ['get', 'REGION'],
                //     0, '#e64a19',
                //     11646, '#e64a19',
                //     174725666, '#e64a19',
                //     349437485, '#e64a19',
                //     698863323, '#e64a19',
                //     873576243, '#e64a19',
                //     1048289162, '#e64a19',
                //     1397715000, '#e64a19',
                // ]
                , 'fill-outline-color': '#111111'
            }
        }, 'waterway-label');

        map.addLayer({
            id: 'reg',
            type: 'fill',
            source: 'regions',
            'source-layer': 'gadm36_PHL-49t1ot',
            'maxzoom': 7,
            paint: {
                'fill-color': '#b71c1c'
                // [
                //     'interpolate',
                //     ['linear'],
                //     ['get', 'REGION'],
                //     0, '#e64a19',
                //     11646, '#e64a19',
                //     174725666, '#e64a19',
                //     349437485, '#e64a19',
                //     698863323, '#e64a19',
                //     873576243, '#e64a19',
                //     1048289162, '#e64a19',
                //     1397715000, '#e64a19',
                // ]
                , 'fill-outline-color': '#111111'
            }
        }, 'waterway-label');

        map.addSource('places', {
            'type': 'geojson',
            'data': places
        });

        map.addLayer({
            'id': 'poi-labels',
            'type': 'symbol',
            'source': 'places',
            'layout': {
                'text-field': ['get', 'description'],
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-radial-offset': 0.5,
                'text-justify': 'auto',
                "text-size": {
                    stops: [
                        [20, 10],
                        [22, 180]
                    ],
                    base: 5
                }
            },
            paint: {
                "text-color": "#222222",
                "text-opacity": 1
            }
        });

        map.on('click', 'reg', (e) => {
            region_name = e.features[0].properties['REGION'];
            var results = -1;

            d3.json('/reg/' + filterselect.val()).then(function (data) {
                results = data.find(obj => {
                    return obj.region === region_name
                });
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML("<b>" + region_name + "</b><br><p>Correspondents: " + results.count + "</p><p>Average Spending for " + filterselect.val() + ": P" + results.filter.toFixed(2) + "</p>")
                    .addTo(map);
            });
        });

        map.on('click', 'prov', (e) => {
            prov_name = e.features[0].properties['NAME_1'];
            var result = -1;

            d3.json('/prov/' + filterselect.val()).then(function (data) {
                result = data.find(obj => {
                    return obj.province === prov_name
                });
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML("<b>" + prov_name + "</b><br><p>Correspondents: " + result.count + "</p><p>Average Spending for " + filterselect.val() + ": P" + result.filter.toFixed(2) + "</p>")
                    .addTo(map);
            });
        });

        map.on('zoom', () => {
            if (map.getZoom() >= 7 && map.getZoom() <= 8 && currentLevel != 'province') {
                currentLevel = 'province'
                $("#filterselect").val($("#filterselect").val()).change();
                map.setLayoutProperty('poi-labels', 'visibility', 'none');

            } else if (map.getZoom() >= 6 && map.getZoom() <= 7 && currentLevel != 'region') {
                currentLevel = 'region'
                $("#filterselect").val($("#filterselect").val()).change();
                map.setLayoutProperty('poi-labels', 'visibility', 'visible');
            }
        });

        d3.json('/region/Total Expenditure').then(function (data) {
            updateChoroplethMap(data, currentLevel);
        });

    });

    var w = 600;
    var h = 500;
    var padding_left = 200;
    var padding = 50;

    var bar = d3.select("#bar").append("svg")
        .attr("width", w)
        .attr("height", h);

    var extraBar = d3.select("#extraBar").append("svg")
        .attr("width", w)
        .attr("height", h);

    var margin = { top: 10, right: 30, bottom: 50, left: 100 },
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var histo = d3.select("#histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var extraHistogram = d3.select("#extraHistogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var xHisto, histogram, bins, yHisto;

    d3.json('/histo/Total Expenditure').then(function (data) {
        xHisto = d3.scaleLinear()
            .domain([0, 1000000])
            .range([0, width]);

        histogram = d3.histogram()
            .value(function (d) { return d.filter; })
            .domain(xHisto.domain())
            .thresholds(xHisto.ticks(100));

        bins = histogram(data);

        yHisto = d3.scaleLinear()
            .range([height, 0]);
        yHisto.domain([0, d3.max(bins, function (d) { return d.length; })]);

        histo.append("g")
            .attr("id", "xAxisHisto")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xHisto).tickFormat(d3.format('.2s')));

        histo.append("g")
            .attr("id", "yAxisHisto")
            .call(d3.axisLeft(yHisto).tickFormat(d3.format('.2s')));

        histo.append("text")
            .attr("id", "xtableText")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .attr("text-anchor", "middle")
            .text("Total Expenditure Spending (Pesos)");

        histo.append("text")
            .attr("id", "ytableText")
            .attr("x", -60)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .text("Count");

        histo.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function (d) { return "translate(" + xHisto(d.x0) + "," + yHisto(d.length) + ")"; })
            .attr("width", function (d) { return xHisto(d.x1) - xHisto(d.x0) - 1; })
            .attr("height", function (d) { return height - yHisto(d.length); })
            .style("fill", "#69b3a2")
    });

    d3.json('/histogram/essentials').then(function (data) {
        xHisto = d3.scaleLinear()
            .domain([0, 500000])
            .range([0, width]);

        histogram = d3.histogram()
            .value(function (d) { return d.filter; })
            .domain(xHisto.domain())
            .thresholds(xHisto.ticks(100));

        bins = histogram(data);

        yHisto = d3.scaleLinear()
            .range([height, 0]);
        yHisto.domain([0, d3.max(bins, function (d) { return d.length; })]);

        extraHistogram.append("g")
            .attr("id", "xAxisHisto")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xHisto).tickFormat(d3.format('.2s')));

        extraHistogram.append("g")
            .attr("id", "yAxisHisto")
            .call(d3.axisLeft(yHisto).tickFormat(d3.format('.2s')));

        extraHistogram.append("text")
            .attr("id", "xtableText")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .attr("text-anchor", "middle")
            .text("Essential Spending (Pesos)");

        extraHistogram.append("text")
            .attr("id", "ytableText")
            .attr("x", -60)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .text("Count");

        extraHistogram.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function (d) { return "translate(" + xHisto(d.x0) + "," + yHisto(d.length) + ")"; })
            .attr("width", function (d) { return xHisto(d.x1) - xHisto(d.x0) - 1; })
            .attr("height", function (d) { return height - yHisto(d.length); })
            .style("fill", "#69b3a2")
    });

    $("#extraHistogram").css("display", "none");

    d3.json('/region/Total Expenditure').then(function (data) {

        if (currentLevel == 'province') {
            data = data.slice(0, 15);
        }

        data.sort(function (a, b) { return b.filter - a.filter; });

        maxRatio = d3.max(data, function (d) { return d.filter; });

        regions = data.map(function (d) { return eval("d." + currentLevel); });

        xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

        yScale = d3.scaleBand()
            .domain(regions)
            .rangeRound([padding, h - padding])
            .padding(0.1);

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('.2s'));
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
            .text("Average Total Expenditure Spending (Pesos)");

        bar.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", padding_left + 1)
            .attr("y", d => yScale(eval("d." + currentLevel)))
            .attr("width", d => xScale(d.filter) - 50)
            .attr("height", d => yScale.bandwidth())
            .style("fill", "#1e88e5")

        d3.json('/descriptions/Total Expenditure').then(function (data) {
            $("#explanation").text(data[0].desc)
        });
    });

    d3.json('/' + currentLevel + '/nonessentials').then(function (data) {
        let fullData = data;
        if (currentLevel == 'province') {
            data = data.slice(0, 15);
        }

        data.sort(function (a, b) { return b.mean - a.mean; });

        maxRatio = d3.max(data, function (d) { return d.mean; });

        regions = data.map(function (d) { return eval("d." + currentLevel); });

        xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

        yScale = d3.scaleBand()
            .domain(regions)
            .rangeRound([padding, h - padding])
            .padding(0.1);

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('.2s'));
        var yAxis = d3.axisLeft(yScale);

        extraBar.append("g")
            .attr("id", "xAxis")
            .attr("transform", "translate(" + (padding_left - padding) + "," + (h - padding) + ")")
            .call(xAxis);

        extraBar.append("g")
            .attr("id", "yAxis")
            .attr("transform", "translate(" + (padding_left) + ",0)")
            .call(yAxis);

        extraBar.append("text")
            .attr("id", "tableText")
            .attr("x", w / 2)
            .attr("y", h - padding + 40)
            .attr("text-anchor", "middle")
            .text("Average Non-Essential Items Spending (Pesos)");

        extraBar.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", padding_left + 1)
            .attr("y", d => yScale(eval("d." + currentLevel)))
            .attr("width", d => xScale(d.mean) - 50)
            .attr("height", d => yScale.bandwidth())
            .style("fill", "#1e88e5")

        updateChoroplethMap(fullData, currentLevel);
    });

    $("#extraBar").css("display", "none");

    $("#filterselect").on("change", function (event) {
        var selected_filter = $("#filterselect").val();

        if (selected_filter != "Essential/Non Essential") {
            $("#extraBar").css("display", "none");
            $("#extraHistogram").css("display", "none");

            d3.json('/' + currentLevel + '/' + selected_filter).then(function (data) {
                fullData = data;
                updateChoroplethMap(fullData, currentLevel);

                data.sort(function (a, b) { return b.filter - a.filter; });

                if (currentLevel == 'province') {
                    data = data.slice(0, 15);
                }

                maxRatio = d3.max(data, function (d) { return d.filter; });

                regions = data.map(function (d) { return eval("d." + currentLevel); });

                xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

                yScale = d3.scaleBand()
                    .domain(regions)
                    .rangeRound([padding, h - padding])
                    .padding(0.1);

                var xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('.2s'));
                var yAxis = d3.axisLeft(yScale);

                var t = bar.transition()
                    .duration(1000);

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

                bar.select("#tableText").text("Average " + selected_filter + " Spending (Pesos)");

                bar.selectAll("rect")
                    .data(data)
                    .join(function (enter) {
                        enter.append("rect")
                            .attr("x", padding_left + 1)
                            .attr("y", d => yScale(eval("d." + currentLevel)))
                            .attr("width", d => xScale(d.filter) - 50)
                            .attr("height", d => yScale.bandwidth())
                            .style("fill", "#1e88e5");
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", padding_left + 1)
                                .attr("y", d => yScale(eval("d." + currentLevel)))
                                .attr("width", d => xScale(d.filter) - 50)
                                .attr("height", d => yScale.bandwidth())
                                .style("fill", "#1e88e5");
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

                updateChoroplethMap(fullData, currentLevel)
            });

            d3.json('/histo/' + selected_filter).then(function (data) {
                var domWidth = 500000;

                switch (selected_filter) {
                    case 'Total Expenditure':
                    case 'Total Income':
                        domWidth = 1000000;
                        break;
                    case 'Total Non-Food Expenditure':
                        domWidth = 600000;
                        break;
                    case 'Income Difference':
                        domWidth = 500000;
                        break;
                    case 'Total Food Expenditure':
                        domWidth = 400000;
                        break;
                    case 'Transport':
                    case 'Meat':
                    case 'Fish and Seafood':
                        domWidth = 50000;
                        break;
                    case 'Milk, Cheese and Eggs':
                    case 'Special Family Occasion':
                        domWidth = 30000;
                        break;
                    case 'Health':
                    case 'Education':
                    case 'Clothing and Footwear':
                    case 'Communication':
                    case 'Vegetables':
                        domWidth = 20000;
                        break;
                    case 'Mineral Water, Softdrinks, Fruit and Vegetable Juices':
                    case 'Fruit':
                    case 'Coffee, Tea and Cocoa':
                        domWidth = 15000;
                        break;
                    case 'Sugar, Jam and Honey, Chocolate and Confectionery':
                    case 'Alcoholic Beverages':
                    case 'Tobacco':
                    case 'Recreation and Culture':
                        domWidth = 10000;
                        break;
                    case 'Oils and Fats':
                        domWidth = 7000;
                        break;
                    default:
                        domWidth = 1000000;
                }

                xHisto = d3.scaleLinear()
                    .domain([0, domWidth])
                    .range([0, width]);

                histogram = d3.histogram()
                    .value(function (d) { return d.filter; })
                    .domain(xHisto.domain())
                    .thresholds(xHisto.ticks(100));

                bins = histogram(data);

                yHisto = d3.scaleLinear()
                    .range([height, 0]);
                yHisto.domain([0, d3.max(bins, function (d) { return d.length; })]);

                var t = histo.transition()
                    .duration(1000);

                histo.select("#xAxisHisto")
                    .call(function (update) {
                        update.transition(t)
                            .call(d3.axisBottom(xHisto).tickFormat(d3.format('.2s')));
                    });

                histo.select("#yAxisHisto")
                    .call(function (update) {
                        update.transition(t)
                            .call(d3.axisLeft(yHisto).tickFormat(d3.format('.2s')));
                    });

                histo.select("#xtableText").text(selected_filter + " Spending (Pesos)");

                histo.selectAll("rect")
                    .data(bins)
                    .join(function (enter) {
                        enter.append("rect")
                            .attr("x", 1)
                            .attr("transform", function (d) { return "translate(" + xHisto(d.x0) + "," + yHisto(d.length) + ")"; })
                            .attr("width", function (d) { return xHisto(d.x1) - xHisto(d.x0) - 1; })
                            .attr("height", function (d) { return height - yHisto(d.length); })
                            .style("fill", "#69b3a2")
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", 1)
                                .attr("transform", function (d) { return "translate(" + xHisto(d.x0) + "," + yHisto(d.length) + ")"; })
                                .attr("width", function (d) { return xHisto(d.x1) - xHisto(d.x0) - 1; })
                                .attr("height", function (d) { return height - yHisto(d.length); })
                                .style("fill", "#69b3a2")
                        })
                    }, function (exit) {
                        exit.attr("fill", "#cccccc")
                            .call(function (exit) {
                                exit.transition(t)
                                    .attr("width", d => xHisto(0))
                                    .attr("height", d => yHisto(0))
                                    .remove();
                            })
                    }
                    )
            });

            d3.json('/descriptions/' + selected_filter).then(function (data) {
                $("#explanation").text(data[0].desc)
            });
        } else {
            $("#extraBar").css("display", "block");

            d3.json('/' + currentLevel + '/essentials').then(function (data) {
                fullData = data;
                updateChoroplethMap(fullData, currentLevel);

                data.sort(function (a, b) { return b.mean - a.mean; });
                if (currentLevel == 'province') {
                    data = data.slice(0, 15);
                }

                maxRatio = d3.max(data, function (d) { return d.mean; });

                regions = data.map(function (d) { return eval("d." + currentLevel); });

                xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

                yScale = d3.scaleBand()
                    .domain(regions)
                    .rangeRound([padding, h - padding])
                    .padding(0.1);

                var xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('.2s'));
                var yAxis = d3.axisLeft(yScale);

                var t = bar.transition()
                    .duration(1000);

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

                bar.select("#tableText").text("Average Essential Items Spending (Pesos)");

                bar.selectAll("rect")
                    .data(data)
                    .join(function (enter) {
                        enter.append("rect")
                            .attr("x", padding_left + 1)
                            .attr("y", d => yScale(eval("d." + currentLevel)))
                            .attr("width", d => xScale(d.mean) - 50)
                            .attr("height", d => yScale.bandwidth())
                            .style("fill", "#1e88e5");
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", padding_left + 1)
                                .attr("y", d => yScale(eval("d." + currentLevel)))
                                .attr("width", d => xScale(d.mean) - 50)
                                .attr("height", d => yScale.bandwidth())
                                .style("fill", "#1e88e5");
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

            d3.json('/' + currentLevel + '/nonessentials').then(function (data) {
                fullData = data;
                updateChoroplethMap(fullData, currentLevel);

                data.sort(function (a, b) { return b.mean - a.mean; });
                if (currentLevel == 'province') {
                    data = data.slice(0, 15);
                }

                maxRatio = d3.max(data, function (d) { return d.mean; });

                regions = data.map(function (d) { return eval("d." + currentLevel); });

                xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

                yScale = d3.scaleBand()
                    .domain(regions)
                    .rangeRound([padding, h - padding])
                    .padding(0.1);

                var xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('.2s'));
                var yAxis = d3.axisLeft(yScale);

                var t = extraBar.transition()
                    .duration(1000);

                extraBar.select("#xAxis")
                    .call(function (update) {
                        update.transition(t)
                            .call(xAxis);
                    });

                extraBar.select("#yAxis")
                    .call(function (update) {
                        update.transition(t)
                            .call(yAxis);
                    });

                extraBar.select("#tableText").text("Average Non-Essential Items Spending (Pesos)");

                extraBar.selectAll("rect")
                    .data(data)
                    .join(function (enter) {
                        enter.append("rect")
                            .attr("x", padding_left + 1)
                            .attr("y", d => yScale(eval("d." + currentLevel)))
                            .attr("width", d => xScale(d.mean) - 50)
                            .attr("height", d => yScale.bandwidth())
                            .style("fill", "#1e88e5");
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", padding_left + 1)
                                .attr("y", d => yScale(eval("d." + currentLevel)))
                                .attr("width", d => xScale(d.mean) - 50)
                                .attr("height", d => yScale.bandwidth())
                                .style("fill", "#1e88e5");
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

            d3.json('/histogram/nonessentials').then(function (data) {
                xHisto = d3.scaleLinear()
                    .domain([0, 100000])
                    .range([0, width]);

                histogram = d3.histogram()
                    .value(function (d) { return d.filter; })
                    .domain(xHisto.domain())
                    .thresholds(xHisto.ticks(100));

                bins = histogram(data);

                yHisto = d3.scaleLinear()
                    .range([height, 0]);
                yHisto.domain([0, d3.max(bins, function (d) { return d.length; })]);

                var t = histo.transition()
                    .duration(1000);

                histo.select("#xAxisHisto")
                    .call(function (update) {
                        update.transition(t)
                            .call(d3.axisBottom(xHisto).tickFormat(d3.format('.2s')));
                    });

                histo.select("#yAxisHisto")
                    .call(function (update) {
                        update.transition(t)
                            .call(d3.axisLeft(yHisto).tickFormat(d3.format('.2s')));
                    });

                histo.select("#xtableText").text("Non-Essential Spending (Pesos)");

                histo.selectAll("rect")
                    .data(bins)
                    .join(function (enter) {
                        enter.append("rect")
                            .attr("x", 1)
                            .attr("transform", function (d) { return "translate(" + xHisto(d.x0) + "," + yHisto(d.length) + ")"; })
                            .attr("width", function (d) { return xHisto(d.x1) - xHisto(d.x0) - 1; })
                            .attr("height", function (d) { return height - yHisto(d.length); })
                            .style("fill", "#69b3a2")
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", 1)
                                .attr("transform", function (d) { return "translate(" + xHisto(d.x0) + "," + yHisto(d.length) + ")"; })
                                .attr("width", function (d) { return xHisto(d.x1) - xHisto(d.x0) - 1; })
                                .attr("height", function (d) { return height - yHisto(d.length); })
                                .style("fill", "#69b3a2")
                        })
                    }, function (exit) {
                        exit.attr("fill", "#cccccc")
                            .call(function (exit) {
                                exit.transition(t)
                                    .attr("width", d => xHisto(0))
                                    .attr("height", d => yHisto(0))
                                    .remove();
                            })
                    }
                    )
            });

            $("#extraHistogram").css("display", "block");
        }
    });
});