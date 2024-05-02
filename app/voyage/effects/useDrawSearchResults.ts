import { useEffect, useState } from 'react'
import { osmRequest } from '../osmRequest'
import useDrawQuickSearchFeatures from './useDrawQuickSearchFeatures'

export default function useDrawSearchResults(map, state, setOsmFeature) {
	// Photon search results are not full OSM objectfs, lacking tags, so lacking
	// opening times for instance
	const [features, setFeatures] = useState([])
	const vers = state.slice(-1)[0]
	const results = vers?.results
	useEffect(() => {
		if (!map) return

		if (!results) return

		const doFetch = async () => {
			const newFeatures = await Promise.all(
				results.map(async (result) => {
					const { osmId, featureType, latitude, longitude } = result
					const elements = await osmRequest(featureType, osmId, false)
					if (!elements) return
					const element = elements[0]
					// osmRequest lacks lat lon
					const geoElement = { ...element, lat: latitude, lon: longitude }
					return geoElement
				})
			)
			setFeatures(newFeatures)
		}
		doFetch()
		return () => {
			setFeatures([])
		}
	}, [map, setFeatures, results])

	useDrawQuickSearchFeatures(map, features, false, category, setOsmFeature)
}

const category = {
	name: 'search',
	icon: 'search-result',
}
