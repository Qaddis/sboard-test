import type { ConnectionPointType, RectType } from "./types/types"

export const rect1: RectType = {
	position: { x: 100, y: 250 },
	size: { width: 100, height: 100 }
}

export const rect2: RectType = {
	position: { x: 350, y: 400 },
	size: { width: 300, height: 250 }
}

export const cPoint1: ConnectionPointType = {
	point: { x: 150, y: 250 },
	angle: 0
}

export const cPoint2: ConnectionPointType = {
	point: { x: 200, y: 350 },
	angle: 180
}

// export const cPoint1: ConnectionPointType = {
// 	point: { x: 50, y: 250 },
// 	angle: 180
// }

// export const cPoint2: ConnectionPointType = {
// 	point: { x: 500, y: 400 },
// 	angle: 0
// }
