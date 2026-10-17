import { Map, NavigationControl, addProtocol } from 'https://unpkg.com/maplibre-gl@6/dist/maplibre-gl.mjs';
import { Protocol } from 'https://esm.sh/pmtiles@4.3.0';

const protocol = new Protocol();
addProtocol('pmtiles', protocol.tile);

const map = new Map({
    container: 'map',
    hash: true,
    style: {
        version: 8,
        glyphs: 'https://tile.openstreetmap.jp/fonts/{fontstack}/{range}.pbf',
        state: {
            language: { default: 'EN' }
        },
        sources: {
            countries: {
                type: 'vector',
                url: `pmtiles://${new URL('countries.pmtiles', window.location.href).href}`,
                minzoom: 0,
                maxzoom: 5,
                attribution: '<a href="https://www.naturalearthdata.com/" target="_blank">Natural Earth</a>'
            }
        },
        layers: [
            {
                id: 'background',
                type: 'background',
                paint: {
                    'background-color': '#dbeafe'
                }
            },
            {
                id: 'countries-fill',
                type: 'fill',
                source: 'countries',
                'source-layer': 'countries',
                paint: {
                    'fill-color': '#e5e7eb'
                }
            },
            {
                id: 'countries-outline',
                type: 'line',
                source: 'countries',
                'source-layer': 'countries',
                paint: {
                    'line-color': '#64748b',
                    'line-width': 0.6
                }
            },
            {
                id: 'country-labels',
                type: 'symbol',
                source: 'countries',
                'source-layer': 'country_labels',

                layout: {
                    'text-field': [
                        'coalesce',
                        [
                            'get',
                            [
                                'concat',
                                'NAME_',
                                ['global-state', 'language']
                            ]
                        ],
                        ['get', 'NAME_EN'],
                        ['get', 'ADMIN']
                    ],

                    'text-font': ['Noto Sans Regular'],
                    'text-size': 12,
                    'text-allow-overlap': false
                },

                paint: {
                    'text-color': '#1f2937',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1.5
                }
            }
        ]
    },
    center: [139.767125, 35.681236],
    zoom: 2,
    // v6.14.0: 初回描画時に日本語を指定
    globalState: {
        language: 'JA'
    },
});

map.addControl(new NavigationControl());

const select = document.getElementById('language');

select.addEventListener('change', event => {
    const language = event.target.value;

    // MLTの再取得やsetStyle()は不要
    map.setGlobalStateProperty('language', language);

    console.log(map.getGlobalState());
});