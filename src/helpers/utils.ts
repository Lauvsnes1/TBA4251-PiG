import { directions } from './directions'
import { FeatureCollection, Feature, Geometry, GeoJsonObject, GeometryCollection, MultiPoint, LineString, MultiLineString } from 'geojson'
export const generateHTML = (content: string | HTMLElement, className?: string): HTMLDivElement => {
  const div = document.createElement('div')
  div.innerHTML = content as string
  if (className) {
    div.classList.add(className)
  }
  return div
}

type Coords = [number, number]

const mult = 10 ** 5
export const mergeCoords = (coords1: Coords, coords2: Coords): Coords => [
  (coords1[0] * mult + coords2[0] * mult) / mult,
  (coords1[1] * mult + coords2[1] * mult) / mult
]
export const wrapFC = (data: any[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features: data
})

type GeometryWithID = Geometry & {
  id: string
}

const isFeature = (data: GeometryWithID | Feature): data is Feature => data.type === 'Feature'

const isGeometryCollection = (data: GeometryWithID): data is GeometryCollection & { id: string } => data.type === 'GeometryCollection'

export const wrapF = (data: GeometryWithID | Feature): Feature => {
  if (isFeature(data) && !!data.id) {
    return data
  } else {
    const baseGeo = { type: data.type, bbox: data.bbox }
    const geometry = isGeometryCollection(data as any)
      ? {
          ...baseGeo,
          geometries: (data as GeometryCollection).geometries
        }
      : {
          ...baseGeo,
          coordinates: (data as any).coordinates
        }
    return {
      type: 'Feature',
      geometry: geometry as Geometry,
      properties: {},
      id: data.id
    }
  }
}

const moveToDirection = (move: number, direction: Coords): Coords => [direction[0] * move, direction[1] * move]

const nbDirections = directions.length
export const rngMove = (coords: Coords, moveRatio: number): Coords => {
  const direction = Math.floor(Math.random() * nbDirections)
  const move = Math.random() * moveRatio
  return mergeCoords(coords, moveToDirection(move, directions[direction]))
}
