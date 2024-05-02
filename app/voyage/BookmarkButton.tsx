import distance from '@turf/distance'
import Image from 'next/image'
import { useLocalStorage } from 'usehooks-ts'
import { PlaceButton } from './PlaceButtonsUI'

export const pointHash = (point) => point.geometry.coordinates.join('|')

export default function BookmarkButton({ clickedPoint, osmFeature }) {
	const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', [])
	const properties = clickedPoint
		? clickedPoint.data?.features?.length > 0 &&
		  clickedPoint.data.features[0].properties
		: { ...(osmFeature.tags || {}), id: osmFeature.id, type: osmFeature.type }

	const coordinates = clickedPoint
		? [
				clickedPoint.longitude.toFixed(4), // this is ~ 10 m precision, we don't want more than one bookmark every 10 meters
				clickedPoint.latitude.toFixed(4),
		  ]
		: [osmFeature.lon.toFixed(4), osmFeature.lat.toFixed(4)]

	const feature = {
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates,
		},
		properties,
	}

	const same = bookmarks.find((point) => {
		if (point.geometry.type !== 'Point') return false
		return pointHash(point) === pointHash(feature)
	})
	return (
		<PlaceButton>
			<button
				onClick={() =>
					same
						? setBookmarks(
								bookmarks.filter((point) => {
									if (point.geometry.type !== 'Point') return true
									return pointHash(point) !== pointHash(feature)
								})
						  )
						: setBookmarks([...bookmarks, feature])
				}
				title={same ? 'Enlever des favoris' : 'Mettre en favori'}
			>
				<div>
					<Image
						src={same ? '/star-full-gold.svg' : '/star.svg'}
						alt="Icône d'ajout de favori"
						width="50"
						height="50"
					/>
				</div>
				<div>Favori</div>
			</button>
		</PlaceButton>
	)
}
