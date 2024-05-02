import { useEffect, useState } from 'react'
import useDrawQuickSearchFeatures from '../effects/useDrawQuickSearchFeatures'
import { buildOverpassRequest } from '../effects/useOverpassRequest'

const category = {
	name: 'Arceaux vélo',
	icon: 'parking',
	'open by default': true,
}

const radius = 120 // metres
const getLastPoint = (features) => features[0].geometry.coordinates.slice(-1)[0]
export default function useFetchDrawBikeParkings(map, cycling) {
	const [features, setFeatures] = useState(null)
	const lastPoint = cycling?.features && getLastPoint(cycling.features)

	const queryCore =
		lastPoint &&
		`
  node(around:${radius}, ${lastPoint[1]}, ${lastPoint[0]})["bicycle_parking"];
		`

	useEffect(() => {
		if (!queryCore) return

		const doFetch = async () => {
			const body = buildOverpassRequest(queryCore)
			const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
				body
			)}`
			const request = await fetch(url)
			const json = await request.json()

			setFeatures(json.elements)
		}
		doFetch()

		// search area
		//
		// overpass bbox
		// overpass query -> points
		// draw on map -> v1
	}, [queryCore, setFeatures])

	const backgroundColor = '#57bff5'
	useDrawQuickSearchFeatures(
		map,
		cycling && features,
		false,
		category,
		() => null,
		backgroundColor
	)
}
