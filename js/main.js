        mapboxgl.accessToken = 'pk.eyJ1IjoicW5uIiwiYSI6ImNsczB0aG1zMTA0YTAycXA1NG0xNWtmbW0ifQ.0ebmaE5q7kqQ0tTSxdhugQ';

        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-96, 37.5],
        zoom: 4,
        bearing: 0,
        pitch: 0,
        maxBounds: undefined,
        renderWorldCopies: true,
        trackResize: true,
        attributionControl: true,
        customAttribution: undefined,
        logoPosition: 'bottom-left',
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        refreshExpiredTiles: true,
        maxTileCacheSize: null,
        localIdeographFontFamily: null,
        transformRequest: null,
        collectResourceTiming: false,
        fadeDuration: 300,
        crossSourceCollisions: true,
        promoteId: null,
        render: {
            layers: [],
            order: 'render'
        },
        projection: 'albers',
        adaptiveProjection: false,
        theme: 'light',
        sprite: 'mapbox://sprites/mapbox/streets-v11',
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
        localFontFamily: null,
        light: {
            anchor: 'viewport',
            color: 'white',
            intensity: 0.4,
            position: [1.15, 210, 30]
        }
        });

        async function geojsonFetch() { 
            // other operations
            let response = await fetch('assets/us-covid-2020-rates.json');
            let rateData = await response.json();
            map.on('load', function loadingData() {
                map.addSource('rateData', {
                    type: 'geojson',
                    data: rateData
                });
                map.addLayer({
                    'id': 'rateData-layer',
                    'type': 'fill',
                    'source': 'rateData',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'rates'],
                            '#FFEDA0',   // stop_output_0
                            5,          // stop_input_0
                            '#FED976',   // stop_output_1
                            10,          // stop_input_1
                            '#FEB24C',   // stop_output_2
                            15,          // stop_input_2
                            '#FD8D3C',   // stop_output_3
                            20,         // stop_input_3
                            '#FC4E2A',   // stop_output_4
                            25,         // stop_input_4
                            '#E31A1C',   // stop_output_5
                            50,         // stop_input_5
                            '#BD0026',   // stop_output_6
                            100,        // stop_input_6
                            "#800026"    // stop_output_7
                        ],
                        'fill-outline-color': '#BBBBBB',
                        'fill-opacity': 0.7,
                    }
                });
                map.on('mousemove', ({point}) => {
                    const county = map.queryRenderedFeatures(point, {
                        layers: ['rateData-layer']
                    });
                    document.getElementById('text-description').innerHTML = county.length ?
                        `<h3>${county[0].properties.county} County, ${county[0].properties.state}</h3>
                         <p><strong><em>${county[0].properties.rates}</strong> cases per 1000 people</em></p>
                         <p><strong><em>${county[0].properties.cases}</strong> total cases</em></p>
                         <p><strong><em>${county[0].properties.deaths}</strong> deaths</em></p>` :
                        `<p>This map shows the Covid-19 rates throughout the country in 2020. <br /><br />
                            Hover over a county!<br /><br />
                            <a href="https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">Data</a></p>`;
                });        
            });
            const layers = [
                '0-4',
                '5-9',
                '10-14',
                '15-19',
                '20-24',
                '25-49',
                '50-99',
                '100 and more'
            ];
            const colors = [
                '#FFEDA070',
                '#FED97670',
                '#FEB24C70',
                '#FD8D3C70',
                '#FC4E2A70',
                '#E31A1C70',
                '#BD002670',
                '#80002670'
            ];
            const legend = document.getElementById('legend');
            legend.innerHTML = "<b>Covid-19 Rates<br>(per 1000 residents)</b><br><br>";

            layers.forEach((layer, i) => {
                const color = colors[i];
                const item = document.createElement('div');
                const key = document.createElement('span');
                key.className = 'legend-key';
                key.style.backgroundColor = color;

                const value = document.createElement('span');
                value.innerHTML = `${layer}`;
                item.appendChild(key);
                item.appendChild(value);
                legend.appendChild(item);
            });
        }

        geojsonFetch();