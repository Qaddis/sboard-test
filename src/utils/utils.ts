import type { PointType } from "../types/types"

/*
	Сравнение относительно погрешности
	Оказывается, числа с плавающей точкой сравниваются криво :p
*/
export const equals = (a: number, b: number): boolean => {
	return Math.abs(a - b) < 1e-6
}

// Направляющий вектор по углу
export const angleToVector = (deg: number): PointType => ({
	x: Math.cos((deg * Math.PI) / 180),
	y: Math.sin((deg * Math.PI) / 180)
})
