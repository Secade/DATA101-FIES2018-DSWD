$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjYWRlIiwiYSI6ImNrcnU3cHVnNDNvZHQycHRqZnZnNzQxYXQifQ.F-OV6UiB-D5fepALN_4stA';


    var maxRatio, regions,
        xScale, yScale, t;
    var filterselect = $("#filterselect");
    var currentLevel = 'region';

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
        style: 'mapbox://styles/secade/ckt2o6v2f1l6017q9my3hm6a8',
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
            region_name = e.features[0].properties['REGION'];
            var results = -1;

            d3.json('/reg/' + e.features[0].properties['REGION']).then(function (data) {
                results = data.find(obj => {
                    return obj.region === region_name
                });
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML("<b>" + region_name + "</b><br><p>Correspondents: " + results.count + "</p><p>Average Spending for " + filterselect.val() + ": P" + results.filter.toFixed(2) + "</p>")
                    .addTo(map);
            });

            $("#location").text("Selected Location: " + region_name);
        });

        map.on('click', 'prov', (e) => {
            prov_name = e.features[0].properties['NAME_1'];
            var result = -1;

            d3.json('/prov/' + e.features[0].properties['NAME_1']).then(function (data) {
                result = data.find(obj => {
                    return obj.province === prov_name
                });
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML("<b>" + prov_name + "</b><br><p>Correspondents: " + result.count + "</p><p>Average Spending for " + filterselect.val() + ": P" + result.filter.toFixed(2) + "</p>")
                    .addTo(map);
            });

            $("#location").text("Selected Location: " + e.features[0].properties['NAME_1']);
        });

        map.on('zoom', () => {
            if (map.getZoom() >= 7 && map.getZoom() <= 8 && currentLevel != 'province') {
                currentLevel = 'province'
                $("#filterselect").val($("#filterselect").val()).change();
            } else if (map.getZoom() >= 6 && map.getZoom() <= 7 && currentLevel != 'region') {
                currentLevel = 'region'
                $("#filterselect").val($("#filterselect").val()).change();
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



    d3.json('/region/Total Expenditure').then(function (data) {

        if (currentLevel == 'province') {
            data = data.slice(0, 10);
        }

        data.sort(function (a, b) { return b.filter - a.filter; });

        maxRatio = d3.max(data, function (d) { return d.filter; });

        regions = data.map(function (d) { return eval("d." + currentLevel); });

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
            .text("Total Expenditure Spending (Pesos)");

        bar.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", padding_left + 1)
            .attr("y", d => yScale(eval("d." + currentLevel)))
            .attr("width", d => xScale(d.filter) - 50)
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
        var selected_filter = $("#filterselect").val();



        d3.json('/' + currentLevel + '/' + selected_filter).then(function (data) {
            console.log("CHANGING")
            data.sort(function (a, b) { return b.filter - a.filter; });

            if (currentLevel == 'province') {
                data = data.slice(0, 10);
            }

            maxRatio = d3.max(data, function (d) { return d.filter; });

            regions = data.map(function (d) { return eval("d." + currentLevel); });

            xScale = d3.scaleLinear([0, maxRatio], [padding, w - padding_left]);

            yScale = d3.scaleBand()
                .domain(regions)
                .rangeRound([padding, h - padding])
                .padding(0.1);

            var xAxis = d3.axisBottom(xScale);
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

            bar.select("#tableText").text(selected_filter + " Spending (Pesos)");

            bar.selectAll("rect")
                .data(data)
                .join(function (enter) {
                    enter.append("rect")
                        .attr("x", padding_left + 1)
                        .attr("y", d => yScale(eval("d." + currentLevel)))
                        .attr("width", d => xScale(d.filter) - 50)
                        .attr("height", d => yScale.bandwidth())
                        .style("fill", "darkblue");
                }, function (update) {
                    update.call(function (update) {
                        update.transition(t)
                            .attr("x", padding_left + 1)
                            .attr("y", d => yScale(eval("d." + currentLevel)))
                            .attr("width", d => xScale(d.filter) - 50)
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