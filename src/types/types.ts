export type PointType = {
	x: number
	y: number
}

export type SizeType = {
	width: number
	height: number
}

export type RectType = {
	position: PointType // Координаты центра
	size: SizeType
}

export type ConnectionPointType = {
	point: PointType
	angle: number // Угол в градусах
}

export type RectSideType = {
	start: PointType
	end: PointType
}

export interface IRenderData {
	rect1: RectType
	rect2: RectType
	cPoint1: ConnectionPointType
	cPoint2: ConnectionPointType
	path: PointType[]
}
