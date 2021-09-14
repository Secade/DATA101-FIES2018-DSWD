$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjYWRlIiwiYSI6ImNrcnU3cHVnNDNvZHQycHRqZnZnNzQxYXQifQ.F-OV6UiB-D5fepALN_4stA';
    const toggle = document.querySelector('.toggle input')

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

    function binDataTo9(fullData, currentLevel) {
        let ids = { region: 'reg', province: 'prov' };
        let get_field = { region: 'REGION', province: 'NAME_1' };
        let chunks = 9;
        let final = []

        bin9chunks = d3.bin()
            .value(d => d.filter)
            .thresholds((data, min, max) =>
                d3.range(chunks).map(t => min + (t / chunks) * (max - min))
            )

        binnedData = bin9chunks(fullData);
        binnedData.forEach((chunkGroup, i) => {
            chunkGroup.forEach((area) => {
                area.bin = i;
                final.push(area);
            })
        })

        console.log(final);
        return final;
    }

    function updateChoroplethMap(fullData, currentLevel) {
        let ids = { region: 'reg', province: 'prov' };
        let get_field = { region: 'REGION', province: 'NAME_1' };
        let colors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
        let chunks = 9

        binDataTo9(fullData, currentLevel)
        // bin filtered data into 9 chunks for choropleth map
        bin9chunks = d3.bin()
            .value(d => d.filter)
            .thresholds((data, min, max) =>
                d3.range(chunks).map(t => min + (t / chunks) * (max - min))
            )

        const matchExpression = ['match', ['get', get_field[currentLevel]]];
        // Calculate color values for each region
        binnedData = bin9chunks(fullData);

        binnedData.forEach((chunkGroup, i) => {
            //layers.push(`₱${chunkGroup.x0.toFixed(0)} - ₱${chunkGroup.x1.toFixed(0)}`);
            // update legend values
            if (i == 0) {
                //console.log($('#legendRangeMin'))
                $('#legendRangeMin').text(`₱${chunkGroup.x0.toFixed(0)}`);
            } else if (i == binnedData.length - 1) {
                $('#legendRangeMax').text(`₱${chunkGroup.x1.toFixed(0)}`);
            }

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

        // map.on('click', function (e) {
        //     console.log(e);
        //     console.log(map.getCenter());
        //     console.log(map.getZoom());
        //     console.log(e.lngLat)
        // });

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
            var wages = 0;
            const onOff = toggle.parentNode.querySelector('.onoff')

            if ($("#filterselect").val() == "Essential-Non Essential") {
                if (onOff.textContent == 'Essential') {
                    d3.json('/' + currentLevel + '/essentials').then(function (data) {
                        results = data.find(obj => {
                            return obj.region === region_name
                        });
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<b>" + region_name + "</b><br><p>Average Spending for Essentials: P" + results.filter.toFixed(2) + "</p>")
                            .addTo(map);
                    });
                } else {
                    d3.json('/' + currentLevel + '/nonessentials').then(function (data) {
                        results = data.find(obj => {
                            return obj.region === region_name
                        });
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<b>" + region_name + "</b><br><p>Average Spending for Non-Essentials: P" + results.filter.toFixed(2) + "</p>")
                            .addTo(map);
                    });
                }

            } else {

                d3.json('/wage/' + region_name).then(function (data) {
                    wages = data[0].wage
                });

                d3.json('/reg/' + filterselect.val()).then(function (data) {
                    results = data.find(obj => {
                        return obj.region === region_name
                    });
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML("<b>" + region_name + "</b><br><p>Correspondents: " + results.count + "</p><p>Average Spending for " + filterselect.val() + ": P" + results.filter.toFixed(2) + "</p><p>Minimum Wage: P" + wages + "</p>")
                        .addTo(map);
                });
            }



        });

        map.on('click', 'prov', (e) => {
            prov_name = e.features[0].properties['NAME_1'];
            var result = -1;
            const onOff = toggle.parentNode.querySelector('.onoff')


            if ($("#filterselect").val() == "Essential-Non Essential") {
                if (onOff.textContent == 'Essential') {
                    d3.json('/' + currentLevel + '/essentials').then(function (data) {
                        result = data.find(obj => {
                            return obj.province === prov_name
                        });
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<b>" + prov_name + "</b><br><p>Average Spending for Essentials: P" + result.filter.toFixed(2) + "</p>")
                            .addTo(map);
                    });
                } else {
                    d3.json('/' + currentLevel + '/nonessentials').then(function (data) {
                        result = data.find(obj => {
                            return obj.province === prov_name
                        });
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<b>" + prov_name + "</b><br><p>Average Spending for Non-Essentials: P" + result.filter.toFixed(2) + "</p>")
                            .addTo(map);
                    });
                }

            } else {

                d3.json('/prov/' + filterselect.val()).then(function (data) {
                    result = data.find(obj => {
                        return obj.province === prov_name
                    });
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML("<b>" + prov_name + "</b><br><p>Correspondents: " + result.count + "</p><p>Average Spending for " + filterselect.val() + ": P" + result.filter.toFixed(2) + "</p>")
                        .addTo(map);
                });
            }

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
            //console.log(data)
            updateChoroplethMap(data, currentLevel);
        });
    });


    toggle.addEventListener('click', () => {
        const onOff = toggle.parentNode.querySelector('.onoff')

        onOff.textContent = toggle.checked ? 'Essential' : 'Non-Essential'

        if ($("#filterselect").val() == "Essential-Non Essential") {
            if (onOff.textContent == 'Essential') {
                d3.json('/' + currentLevel + '/essentials').then(function (data) {
                    fullData = data;
                    updateChoroplethMap(fullData, currentLevel);
                    $("#bar").css("display", "block");
                    $("#extraBar").css("display", "none");
                    $("#histogram").css("display", "none");
                    $("#extraHistogram").css("display", "block");
                })
            } else if (onOff.textContent == 'Non-Essential') {
                d3.json('/' + currentLevel + '/nonessentials').then(function (data) {
                    fullData = data;
                    updateChoroplethMap(fullData, currentLevel);
                })
                $("#bar").css("display", "none");
                $("#extraBar").css("display", "block");
                $("#histogram").css("display", "block");
                $("#extraHistogram").css("display", "none");
            }

        }
    })

    var w = 645;
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
    $(".toggle").css("display", "none");

    d3.json('/region/Total Expenditure').then(function (data) {

        if (currentLevel == 'province') {
            data = data.slice(0, 15);
        }

        data = binDataTo9(data);
        console.log(data)

        data.sort(function (a, b) { return b.filter - a.filter; });

        maxRatio = d3.max(data, function (d) { return d.filter; });

        minRatio = d3.min(data, function (d) { return d.filter; });

        regions = data.map(function (d) { return eval("d." + currentLevel); });

        xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

        yScale = d3.scaleBand()
            .domain(regions)
            .rangeRound([padding, h - padding])
            .padding(0.1);

        var colorScale = (data) => {
            let colors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
            return colors[data.bin]
        }

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
            .style("fill", d => colorScale(d))

        // d3.json('/descriptions/Total Expenditure').then(function (data) {
        //     $("#explanation").text(data[0].desc)
        // })

        $("#explanation").text("This graph shows us the general expenditure behavior of Filipino households through the total expenses incurred by a Filipino household. It can be observed that in terms of regional averages, there is a great disparity between regions. This can be accounted towards the varying consumer price index that greatly differs across the different regions of the country as well. Similar to other household expenses categories, regions NCR, 4-A, and 3 naturally leads the regional average on total expenditure by spending around two hundred fifty thousand to three hundred fifty thousand pesos. Generally, it can be observed that Filipino households normally spend around one hundred to two hundred fifty thousand pesos towards household expenditures.")
    });

    d3.json('/' + currentLevel + '/nonessentials').then(function (data) {
        let fullData = data;
        if (currentLevel == 'province') {
            data = data.slice(0, 15);
        }

        data = binDataTo9(data);
        data.sort(function (a, b) { return b.filter - a.filter; });

        maxRatio = d3.max(data, function (d) { return d.filter; });

        minRatio = d3.min(data, function (d) { return d.filter; });

        var colorScale = (data) => {
            let colors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
            return colors[data.bin]
        }

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
            .attr("width", d => xScale(d.filter) - 50)
            .attr("height", d => yScale.bandwidth())
            .style("fill", d => colorScale(d))

        updateChoroplethMap(fullData, currentLevel);
    });

    $("#extraBar").css("display", "none");

    $("#filterselect").on("change", function (event) {
        var selected_filter = $("#filterselect").val();

        $("#currFilter").text(selected_filter)

        if (selected_filter != "Essential-Non Essential") {
            // $("#extraBar").css("display", "none");
            // $("#extraHistogram").css("display", "none");
            $(".toggle").css("display", "none");

            d3.json('/' + currentLevel + '/' + selected_filter).then(function (data) {
                fullData = data;
                data = binDataTo9(data);
                updateChoroplethMap(fullData, currentLevel);

                data.sort(function (a, b) { return b.filter - a.filter; });

                if (currentLevel == 'province') {
                    data = data.slice(0, 15);
                }

                maxRatio = d3.max(data, function (d) { return d.filter; });

                minRatio = d3.min(data, function (d) { return d.filter; });

                var colorScale = (data) => {
                    let colors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
                    return colors[data.bin]
                }

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
                            .style("fill", d => colorScale(d));
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", padding_left + 1)
                                .attr("y", d => yScale(eval("d." + currentLevel)))
                                .attr("width", d => xScale(d.filter) - 50)
                                .attr("height", d => yScale.bandwidth())
                                .style("fill", d => colorScale(d));
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


        } else {
            $("#bar").css("display", "none");
            $("#extraBar").css("display", "block");
            $("#histogram").css("display", "block");
            $("#extraHistogram").css("display", "none");
            $(".toggle").css("display", "block");


            d3.json('/' + currentLevel + '/essentials').then(function (data) {
                data = binDataTo9(data);
                fullData = data;
                //console.log(fullData)
                //updateChoroplethMap(fullData, currentLevel);

                data.sort(function (a, b) { return b.filter - a.filter; });
                if (currentLevel == 'province') {
                    data = data.slice(0, 15);
                }

                maxRatio = d3.max(data, function (d) { return d.filter; });

                minRatio = d3.min(data, function (d) { return d.filter; });

                var colorScale = (data) => {
                    let colors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
                    return colors[data.bin]
                }

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
                            .attr("width", d => xScale(d.filter) - 50)
                            .attr("height", d => yScale.bandwidth())
                            .style("fill", d => colorScale(d));
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", padding_left + 1)
                                .attr("y", d => yScale(eval("d." + currentLevel)))
                                .attr("width", d => xScale(d.filter) - 50)
                                .attr("height", d => yScale.bandwidth())
                                .style("fill", d => colorScale(d));
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
                data = binDataTo9(data);
                updateChoroplethMap(fullData, currentLevel);

                data.sort(function (a, b) { return b.filter - a.filter; });
                if (currentLevel == 'province') {
                    data = data.slice(0, 15);
                }

                maxRatio = d3.max(data, function (d) { return d.filter; });

                minRatio = d3.min(data, function (d) { return d.filter; });

                var colorScale = (data) => {
                    let colors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
                    return colors[data.bin]
                }

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
                            .attr("width", d => xScale(d.filter) - 50)
                            .attr("height", d => yScale.bandwidth())
                            .style("fill", d => colorScale(d));
                    }, function (update) {
                        update.call(function (update) {
                            update.transition(t)
                                .attr("x", padding_left + 1)
                                .attr("y", d => yScale(eval("d." + currentLevel)))
                                .attr("width", d => xScale(d.filter) - 50)
                                .attr("height", d => yScale.bandwidth())
                                .style("fill", d => colorScale(d));
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
        }

        //REASONING FOR SWITCH CASE:
        //- The function below is the original code to load the filter descriptions however,
        //the heroku server is overloading due to length of the paragraph that is placed into 1 data cell.
        //This is why there is a switch case here for the description to load in the herokue server without overloading.
        //If this was run locally, the commented code below would load the description properly.

        // d3.json('/descriptions/'+selected_filter).then(function (data) {
        //     $("#explanation").text(data[0].desc)
        // })

        var desc = "";

        switch (selected_filter) {
            case "Sugar, Jam and Honey, Chocolate and Confectionery":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on sugar products. Similar to other consumable items, sugar products tend to exhibit similar allocations from Filipino households across the entire country. Although it can also be noticed that regions 3, and ARMM leads the average regional spending with an average expenditure of around two-thousand five hundred pesos while regions 10, and 13 lags behind the rest of the regions with an average spending of around one thousand three hundred pesos."
                break;
            case "Alcoholic Beverages":
                desc = "This graph shows us the ranking of regions according to the average annual spending of households on alcoholic products. It can be observed that Metropolitan Manila leads this category followed by the rest of the regions by small discrepancies. However, ARMM only spends less than a hundred pesos which is considerably lower in comparison to the rest of the Philippine regions. ARMM’s low consumption on alcoholic products may be due to their cultural or religious background that controls their consumption of alcoholic products.";
                break;
            case "Tobacco":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on tobacco products. It can be observed that the consumption of this vice greatly differs from other forms of vices such as alcoholic products such that the disparities between the leading and the tailing regions is high. Regions 3, 4-A, and metropolitan manila leads the regions with an average spending of more than four-thousand pesos while the rest of the regions are on the lower side of the scale spending around one-thousand to two thousand pesos. ";
                break;
            case "Recreation and Culture":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on recreational and cultural activities. Generally, it can be observed that the regional averages are on the lower side of the scale such that regional averages only ranges from around five hundred to around two-thousand five-hundred pesos. This entails that Filipino households does not necessarily allocate as much on recreational and cultural expenditures. ";
                break;
            case "Special Family Occasion":
                desc = "This graph shows us the spending behavior of regions according to the average spending of households on special occasions. We see that regions 6, 7, 3 and 13 leads the regions with an average regional spending of more than seven thousand pesos. This can be accounted to the culture of how Filipino households tend to exhibit celebrations over family accomplishments and the like. Although it can also be noticed that Filipino households tend to greatly differ on the manner of budgetary allocation towards special family occasions.";
                break;
            case "Health":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on health services and expenditures. Generally, it can be observed that Filipino households tend to spend less than three thousand pesos on health expenditures with regions 4-A, 3, 6, and NCR leading in terms of regional average spending towards health-related expenditures. Similar to education, health related expenditures are normally placed with great importance towards a household’s budgetary allocations which probably explains the tightly packed distribution of Filipino households towards health expenditures. ";
                break;
            case "Education":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on education. Although with a very small discrepancy, CAR leads this category over metropolitan manila which is also closely followed by region 4-A with an average regional spending of more than eight thousand pesos. While the rest of regions fall between the two thousand to under-six-thousand-peso range. Given the importance of education, it can also be observed that Filipino households tend to be grouped closely together in terms of a household’s expenditure priority over educational expenses. ";
                break;
            case "Clothing and Footwear":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on clothing and footwear. It can be observed that Metropolitan Manila leads this category along with regions with similar spending behaviors such as regions 4A, 3, 6, and CAR. While the rest of the regions follow below the six-thousand-peso mark. Similar to other goods, ARMM can be seen to tail the rest of the Philippine regions in the amount of expenditure allocated towards clothing and footwear. ";
                break;
            case "Transport":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on transportation services. NCR leads the regional ranking which is also closely followed by regions 4-A and 3. This can be accounted to the relatively higher per unit cost of transportation services within these regions or the lack for the need of much movement in other regions. The rest of the regions tend to experience similar instances given that they have small discrepancies between them. ";
                break;
            case "Communication":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on communication services. Similar to the spending behavior of regions, Metropolitan Manila leads this category by a huge margin with ARMM as the tail of the regional ranking. This may be accounted due to the higher per unit cost of communication services in comparison to other consumable goods normally accessed by Filipino households. Furthermore, it can be observed that a very small percentage of Filipino households spend more than six thousand pesos on communication services but the extremities of spending towards the good can reach up to twenty thousand pesos showing great disparity between spending patterns of Filipino households with communication services.";
                break;
            case "Mineral Water, Softdrinks, Fruit and Vegetable Juices":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on liquid drinks. Generally it can be observed that the average regional spending on liquid drinks are relatively lower in terms of other consumable items such that the leading region only consumes around four thousand pesos worth of liquid drinks. Regions metropolitan manila, 3, and 1 leads the group with an average spending of more than three-thousand five hundred pesos while regions 5, 4-B, and CAR tails the rest of the Philippine regions with an average spending of almost two-thousand pesos. The generally low household allocation towards liquid drinks can be justified towards the importance of liquid drinks such that the good is populated with numerous low price substitutes that households usually use in a day to day basis.";
                break;
            case "Meat":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on meat products. This pertains to chicken, pork and beef related products. First, it can be seen that meat products tend to be significantly higher than other protein sources such as fish and seafood products by almost five thousand pesos. Generally, it can be observed that Filipino households tend to allocate a huge portion of their household income towards meat products such that Filipino households normally spend around five-thousand to fifteen thousand pesos. In terms of regional averages, regions NCR, 3, and 4-A leads the regions by having an average expenditure of more than sixteen thousand pesos while ARMM greatly tails behind the rest of the Philippine regions with an average spending of around three thousand pesos. ARMM’s low allocation towards meat products may be due to how their cultural or religious background tends to rely more on other protein sources for their household’s daily food intake.";
                break;
            case "Fish and Seafood":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on fish and sea food products. In terms of regional averages, it can be observed that all regions tend to have a close expenditure behavior that ranges from eight thousand to twelve thousand pesos. This may be due to how fish and sea food products are relatively cheaper than other protein sources such as beef or pork. Further, given the importance of protein sources in everyday activities and expenditures of households it is only natural that households would tend to allocate higher budgets in protein sources than other consumable goods.";
                break;
            case "Milk, Cheese and Eggs":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on dairy products. It can be observed that consumption behavior on dairy products are closer together in comparison to other consumable products. This shows that Filipino households tend to practice similar expenditure behavior towards the good. In terms of average regional spending, regions Metropolitan Manila, 3, and 4-A leads the other regions with an average household spending of around eight thousand pesos with ARMM having the least amount of financial capacity spent on dairy products at around three thousand pesos. ";
                break;
            case "Oils and Fats":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on oil fat products. Generally, it can be observed that allocation towards the good is relatively low compared to other food items such that Filipino households tend to spend around a thousand pesos towards the good. While in terms of regional averages, metropolitan manila leads the category with an average regional spending of around two-thousand pesos which places it above the region which spends least with a margin of almost a thousand pesos.";
                break;
            case "Fruit":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on fruits. Similar to other food items, metropolitan manila leads by a margin of five hundred pesos than the next grouping of regions which consists of regions 3, 5, CAR, 6, and 4-A. Also, it can be seen that fruits can be placed in the lower side of budgetary food allocations in comparison to other food items that Filipino households spend on. It can also be observed that most of the regions that does not spend as much on fruits tend to be agricultural regions. This may be due to how agricultural regions has the opportunity of growing their own fruits or fruit items can be bought at a relatively lower price in comparison to those regions who are highly urbanized such as the regions who allocate higher financial capacity towards fruits.";
                break;
            case "Vegetables":
                desc = "This graph shows us the spending behavior of regions according to the average annual spending of households on vegetable items. Unlike other consumable items, the ranking all through out the regions experiences small discrepancies from one ranking to the next. CAR leads the ranking on vegetable expenditures while region 7 tails behind the rest of the Philippine regions. Meanwhile, it can be observed that ARMM tends to spend relatively and significantly higher on vegetable items in comparison to other food sources and regions. Generally, vegetable items are represented with a smoother graph showing that Filipino households tend to allocate similar amount of budgetary allocation towards vegetable items.";
                break;
            case "Coffee, Tea and Cocoa":
                desc = "This graph shows us the ranking of regions according to the average annual spending of households on caffeinated products. It can be observed that Metropolitan Manila leads this category followed by the rest of the regions by small discrepancies. Comparing the consumption of households with alcoholic beverages, it can be observed that the average spending of households within the two products are quite huge amounting to around three thousand pesos. ";
                break;
            case "Total Income":
                desc = "This shows us the total income received by Filipino households. On the average, a Filipino household would tend to receive around one hundred to two hundred thousand pesos a year. While regional averages show that the NCR region greatly leads by the rest of the regions with a huge margin of around fifty thousand pesos. Given the importance of household income and a family’s capacity towards household expenditure, income is often used a manner of capacity indicator towards a household’s educational, health and development sustainability. This can be accounted to the fact that income is what allows households to have access to a better state of living allowing them to experience better educational, health, and labor opportunities. ";
                break;
            case "Total Food Expenditures":
                desc = "The graph tells us the total expenditure incurred by Filipino households solely allotted towards food items. Generally, Filipino household tend to spend around eighty to a hundred and fifty thousand pesos on food items alone. More specifically, we can see that the average regional expenditures for food items greatly varies from one region to the next. The region that spends most on food items are regions NCR, 3, and 4-A. The ranking arrived with food items is also identical to that of total expenditure and the general trend amongst other essential and non-essential items. This entails how allocation towards food items compliment a significant portion of a household’s budgetary allocation and/or expenditures throughout the year.";
                break;
            case "Total Non-Food Expenditure":
                desc = "This graph shows us the total non-food expenditure incurred by Filipino households on the average. Non-food expenditures include expenditure towards household necessities such as water, electricity, house fixtures, recreation and etc. Naturally, we can observe that NCR leads by the rest of the region with a huge margin of around twenty thousand pesos to the next region on the ranking. This can be accounted towards the higher income status or capacity of a household to spend of the region. Generally, we observe that the rest of the regions are closely stacked together showing an average spending which ranges from a hundred to a hundred eighty thousand pesos, with the exemption of regions ARMM and 9.";
                break;
            case "Total Expenditure":
                desc = "This graph shows us the general expenditure behavior of Filipino households through the total expenses incurred by a Filipino household. It can be observed that in terms of regional averages, there is a great disparity between regions. This can be accounted towards the varying consumer price index that greatly differs across the different regions of the country as well. Similar to other household expenses categories, regions NCR, 4-A, and 3 naturally leads the regional average on total expenditure by spending around two hundred fifty thousand to three hundred fifty thousand pesos. Generally, it can be observed that Filipino households normally spend around one hundred to two hundred fifty thousand pesos towards household expenditures.";
                break;
            case "Income Difference":
                desc = "This graph shows us the context of income inequality within Filipino households and Philippine regions. Generally, it can be observed that income inequality still poses great disparities within Filipino households. Moreover, Regions 7, CAR, 2, 1, and NCR greatly leads this category by having a household income difference of more than ninety-thousand pesos. This entails that the income received by the households greatly differ from one another. This may be due to the lack of labor opportunities to sustain higher household income or lower rates technical skill development which would allow households to reap the opportunities of the labor market. ";
                break;
            case "Essential-Non Essential":
                desc = "This graph shows us the spending behavior of regions according to the regional average annual spending of households on essential and non-essential items. Essential items groups goods and services that are essential towards daily function of households while non-essential items groups together items that can be considered either leisure or luxury goods. For essential items, it can be seen that regions NCR, 4-A and 3 leads the average regional expenditure for essential items while regions 3, 4-A and 6 leads the regions on non-essential items. Given that essential items are grouped together, it can be observed that given their financial capacity, regions such as 9 and ARMM lags behind the rest of the Philippine regions in essential spending. This entails that an average household over these regions tend to experience lower capacity to procure essential items for their household. This graph shows us the national spending behavior Filipino households on essential and non-essential items. Essential items groups goods and services that are essential towards daily function of households while non-essential items groups together items that can be considered either leisure or luxury goods. It can be seen that Filipinos naturally favor to spend on essential items rather than non-essential items. In terms of range alone, the disparity between the grouped goods greatly differs from one another. Furthermore, the grouping of household expenditure tells us that Filipino households shows a similar reaction towards essential and non-essential items such that most Filipino households would spend around fifty to a hundred thousand pesos on essential items and spend five to fifteen thousand pesos on non-essential items.";
                break;
        }

        $("#explanation").text(desc)

    });
});