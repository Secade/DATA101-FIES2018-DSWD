$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjYWRlIiwiYSI6ImNrcnU3cHVnNDNvZHQycHRqZnZnNzQxYXQifQ.F-OV6UiB-D5fepALN_4stA';

    const bounds = [
        [105, -2], // Southwest coordinates
        [140, 28] // Northeast coordinates
    ];

    var map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
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
    });
});


