# Web GIS Application TBA4251

Welcome to this GIS (Geographic Information System) application! This project is developed as part of the NTNU 4th year course TBA4251 "Programming in Geomatics". It's designed for non-professional GIS users with little to no experience. You can run the application either by cloning the repository and running it with npm, or simply by visiting this [website](https://lauvsnes1.github.io/TBA4251-PiG/). To get started, click the settings wheel in the top-right corner and select "Start tutorial".

## Run locally

Clone the project and run:

### `npm i`

then run:

### `npm start`

## Tech Stack (most important)

- React: v. 18.2.0
- TypeScript: v. 4.9.5
- React-DOM: v. 18.2.0
- Mapbox-GL: v. 2.13.0 - For rendering map and geographical layers.
- Turf JS: v. 6.5.0 - For geospatial analysis.
- React-Map-GL: v. 7.0.21
- React Joyride: v. 2.0.5 - For website tutorial.

## Purpose

The purpose of this application is to present geographical data in a straightforward and appealing manner, along with the ability to conduct basic spatial analysis. The application aims to be intuitive and user-friendly, enabling users with a minimal understanding of geographic information science to comprehend and utilize the application for solving simple GIS tasks. The goal is for a first-year student in the Geomatics study at NTNU to easily perform the tutorial.

## Usage

This application is accessible at [https://lauvsnes1.github.io/TBA4251-PiG/](https://lauvsnes1.github.io/TBA4251-PiG/) and supports files of type GeoJSON and JSON. The map is centered on Trondheim, Norway, but you can zoom into layers anywhere in the world. By clicking on the settings icon and selecting "Start tutorial", you can learn how to use the basic geospatial tools. The example task will guide you in identifying the best fishing spots in Trondheimsfjorden.

## Additional Packages Used

This project has made use of several npm packages to facilitate its development. These include (but are not limited to):

- [@emotion/react](https://www.npmjs.com/package/@emotion/react): v. 11.10.6
- [@emotion/styled](https://www.npmjs.com/package/@emotion/styled): v. 11.10.6
- [@mapbox/mapbox-gl-draw](https://www.npmjs.com/package/@mapbox/mapbox-gl-draw): v. 1.4.1
- [@mui/icons-material](https://www.npmjs.com/package/@mui/icons-material): v. 5.11.9
- [@mui/material](https://www.npmjs.com/package/@mui/material): v. 5.11.10
- [@mui/styles](https://www.npmjs.com/package/@mui/styles): v. 5.12.0
- [@turf modules](https://www.npmjs.com/package/@turf/turf): v. 6.5.0
- [@types/geojson](https://www.npmjs.com/package/@types/geojson): v. 7946.0.10
- [@types/mapbox-gl](https://www.npmjs.com/package/@types/mapbox-gl): v. 2.7.10
- [@types/node](https://www.npmjs.com/package/@types/node): v. 16.18.13
- [@types/react](https://www.npmjs.com/package/@types/react): v. 18.0.28
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom): v. 18.0.11
- [file-saver](https://www.npmjs.com/package/file-saver): v. 2.0.5
- [mapbox-gl-draw-rectangle-mode](https://www.npmjs.com/package/mapbox-gl-draw-rectangle-mode): v. 1.0.4
- [react-bootstrap-sidebar-menu](https://www.npmjs.com/package/react-bootstrap-sidebar-menu): v. 2.0.3
- [react-color](https://www.npmjs.com/package/react-color): v. 2.19.3
- [react-scripts](https://www.npmjs.com/package/react-scripts): v. 5.0.1
- [uid](https://www.npmjs.com/package/uid): v. 2.0.1
- [Chroma-JS](https://gka.github.io/chroma.js/#chroma-distance): v. 2.4.2
- -[react-toastify](https://fkhadra.github.io/react-toastify): v. 9.1.3

## Acknowledgements

- This app was created with create-react-app using the TypeScript template.
