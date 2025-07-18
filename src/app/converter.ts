import type {
	ConnectionPointType,
	PointType,
	RectSideType,
	RectType
} from "../types/types"
import { angleToVector, equals } from "../utils/utils"

// Делим прямоугольник на грани и находим для каждой перпендикуляр
const getRectSides = ({ position, size }: RectType): RectSideType[] => {
	const offsetX: number = size.width / 2
	const offsetY: number = size.height / 2

	const topLeft: PointType = {
		x: position.x - offsetX,
		y: position.y - offsetY
	}
	const topRight: PointType = {
		x: position.x + offsetX,
		y: position.y - offsetY
	}
	const bottomLeft: PointType = {
		x: position.x - offsetX,
		y: position.y + offsetY
	}
	const bottomRight: PointType = {
		x: position.x + offsetX,
		y: position.y + offsetY
	}

	return [
		{ start: topLeft, end: topRight }, // Верхняя грань
		{ start: bottomLeft, end: bottomRight }, // Нижняя грань
		{ start: bottomLeft, end: topLeft }, // Левая грань
		{ start: bottomRight, end: topRight } // Правая грань
	]
}

// Проверка - лежит точка на грани или нет?
const isPointOnSide = (point: PointType, side: RectSideType): boolean => {
	if (
		point.x < Math.min(side.start.x, side.end.x) ||
		point.x > Math.max(side.start.x, side.end.x) ||
		point.y < Math.min(side.start.y, side.end.y) ||
		point.y > Math.max(side.start.y, side.end.y)
	)
		return false

	// Псевдоскалярное произведение для определения того, лежит ли точка на отрезке
	const sideProduct =
		(point.x - side.start.x) * (side.end.y - point.y) -
		(side.end.x - point.x) * (point.y - side.start.y)

	return equals(sideProduct, 0)
}

// Вектор нормали (вектор, перпендикулярный грани)
const getSideNormal = (side: RectSideType, rectPos: PointType): PointType => {
	const dx = side.end.x - side.start.x
	const dy = side.end.y - side.start.y

	// Для горизонтальных граней
	if (equals(dy, 0)) {
		const normalY = side.start.y < rectPos.y ? -1 : 1
		return { x: 0, y: normalY }
	}

	// Для вертикальных граней
	if (equals(dx, 0)) {
		const normalX = side.start.x < rectPos.x ? -1 : 1
		return { x: normalX, y: 0 }
	}

	// Если прямоугольник не выровнен по сетке
	const len = Math.sqrt(dx ** 2 + dy ** 2)
	return { x: -dy / len, y: dx / len }
}

// Проверка на то, перпендикулярен ли угол и направлен ли он наружу
const isAnglePerp = (side: RectSideType, angle: number, rectPos: PointType) => {
	const sideNormal = getSideNormal(side, rectPos)
	const angleVector = angleToVector(angle)

	// Проверка перпендикулярности скалярное произведение
	const dot = sideNormal.x * angleVector.x + sideNormal.y * angleVector.y

	return equals(dot, 1)
}

// Проверка на пересечение ломанной прямоугольников
const isPathIntersects = (
	point1: PointType,
	point2: PointType,
	{ size, position }: RectType
): boolean => {
	// Границы прямоугольника
	const minX = position.x - size.width / 2
	const maxX = position.x + size.width / 2
	const minY = position.y - size.height / 2
	const maxY = position.y + size.height / 2

	// Проверка относительно границ прямоугольника
	if (
		Math.max(point1.x, point2.x) < minX ||
		Math.min(point1.x, point2.x) > maxX ||
		Math.max(point1.y, point2.y) < minY ||
		Math.min(point1.y, point2.y) > maxY
	)
		return false

	// Если отрезок вертикальный
	if (equals(point1.x, point2.x))
		return (
			point1.x > minX &&
			point1.x < maxX &&
			Math.min(point1.y, point2.y) < maxY &&
			Math.max(point1.y, point2.y) > minY
		)

	// Если отрезок горизонтальный
	if (equals(point1.y, point2.y))
		return (
			point1.y > minY &&
			point1.y < maxY &&
			Math.min(point1.x, point2.x) < maxX &&
			Math.max(point1.x, point2.x) > minX
		)

	return true
}

// Получение прямоугольника сразу с отступами
const getBoundingBox = (rect: RectType, margin: number): RectType => {
	return {
		position: rect.position,
		size: {
			width: rect.size.width + margin * 2,
			height: rect.size.height + margin * 2
		}
	}
}

// Вычисление длины пути
const getPathLength = (points: PointType[]): number => {
	let length: number = 0

	for (let i = 1; i < points.length; i++) {
		const prev = points[i - 1]
		const next = points[i]

		length += Math.abs(next.x - prev.x) + Math.abs(next.y - next.y)
	}

	return length
}

// Строим ломанную между точками подсоединения
const buildPath = (
	cPoint1: ConnectionPointType,
	cPoint2: ConnectionPointType,
	rect1: RectType,
	rect2: RectType
): PointType[] => {
	const margin = 20

	// Направления маршрута относительно точек подсоединения
	const dir1 = angleToVector(cPoint1.angle)
	const dir2 = angleToVector(cPoint2.angle)

	// Точки подсоединения с отступом
	const marginPoint1: PointType = {
		x: cPoint1.point.x + dir1.x * margin,
		y: cPoint1.point.y + dir1.y * margin
	}

	const marginPoint2: PointType = {
		x: cPoint2.point.x + dir2.x * margin,
		y: cPoint2.point.y + dir2.y * margin
	}

	// Прямоугольники с отступами (чтобы ломанная линия не была вплотную)
	const boundingRect1 = getBoundingBox(rect1, 20)
	const boundingRect2 = getBoundingBox(rect2, 20)

	const possiblePath: PointType[][] = []

	// Первый вариант ломанной
	const path1: PointType[] = [
		marginPoint1,
		{ x: marginPoint1.x, y: marginPoint2.y },
		marginPoint2
	]

	// Проверка на пересечение первым вариантом одного из прямоугольника
	if (
		!isPathIntersects(path1[0], path1[1], boundingRect1) &&
		!isPathIntersects(path1[1], path1[2], boundingRect1) &&
		!isPathIntersects(path1[0], path1[1], boundingRect2) &&
		!isPathIntersects(path1[1], path1[2], boundingRect2)
	)
		possiblePath.push([cPoint1.point, ...path1, cPoint2.point])

	// Второй вариант ломаной
	const path2: PointType[] = [
		marginPoint1,
		{ x: marginPoint2.x, y: marginPoint1.y },
		marginPoint2
	]

	// Проверка на пересечение вторым вариантом одного из прямоугольника
	if (
		!isPathIntersects(path2[0], path2[1], boundingRect1) &&
		!isPathIntersects(path2[1], path2[2], boundingRect1) &&
		!isPathIntersects(path2[0], path2[1], boundingRect2) &&
		!isPathIntersects(path2[1], path2[2], boundingRect2)
	)
		possiblePath.push([cPoint1.point, ...path2, cPoint2.point])

	if (possiblePath.length > 0) {
		possiblePath.sort((p1, p2) => getPathLength(p1) - getPathLength(p2))

		return optimizePath(possiblePath[0])
	}

	// Третий вариант, если первые два не подошли
	const path3: PointType[] = [cPoint1.point, marginPoint1]
	if (equals(dir1.y, 0)) {
		// Горизонтальное направление точки подсоединения
		const midY =
			rect1.position.y > rect2.position.y
				? Math.max(
						rect1.position.y + rect1.size.height / 2,
						rect2.position.y + rect2.size.height / 2
				  ) + margin
				: Math.min(
						rect1.position.y - rect1.size.height / 2,
						rect2.position.y - rect2.size.height / 2
				  ) - margin

		path3.push({ x: marginPoint1.x, y: midY })
		path3.push({ x: marginPoint2.x, y: midY })
	} else {
		// Вертикальное направление точки подсоединения
		const midX =
			rect1.position.x > rect2.position.x
				? Math.max(
						rect1.position.x + rect1.size.width / 2,
						rect2.position.x + rect2.size.width / 2
				  ) + margin
				: Math.min(
						rect1.position.x - rect1.size.width / 2,
						rect2.position.x - rect2.size.width / 2
				  ) - margin

		path3.push({ x: midX, y: marginPoint1.y })
		path3.push({ x: midX, y: marginPoint2.y })
	}

	path3.push(marginPoint2, cPoint2.point)

	return optimizePath(path3)
}

// Оптимизируем кривую, убирая точки, которые лежат внутри отрезков
const optimizePath = (points: PointType[]): PointType[] => {
	// Если оптимизировать нечего :|
	if (points.length < 3) return points

	// Сразу сохраняем первую точку подсоединения
	const out: PointType[] = [points[0]]

	// Убираем точки, которые лежат внутри отрезков
	for (let i = 1; i < points.length - 1; i++) {
		const prev = out[out.length - 1]
		const curr = points[i]
		const next = points[i + 1]

		if (
			(equals(prev.x, curr.x) && equals(curr.x, next.x)) ||
			(equals(prev.y, curr.y) && equals(curr.y, next.y))
		)
			continue

		out.push(curr)
	}

	// Добавляем вторую точку подсоединения
	out.push(points[points.length - 1])

	// Вторая итерация для удаления петель
	if (out.length >= 3) {
		const final: PointType[] = [out[0]]

		for (let i = 1; i < out.length; i++) {
			if (
				final.length > 1 &&
				equals(final[final.length - 2].x, out[i].x) &&
				equals(final[final.length - 2].y, out[i].y)
			)
				final.pop()
			else final.push(out[i])
		}

		return final
	}

	return out
}

/*
	То, ради чего вообще тут собрались.
	Функция, которая принимает на вход два прямоугольника и два подсоединения (точка с углом),
	и возвращает массив точек для дальнейшей отрисовки
*/
export const dataConverter = (
	rect1: RectType,
	rect2: RectType,
	cPoint1: ConnectionPointType,
	cPoint2: ConnectionPointType
): PointType[] => {
	const rectSides1 = getRectSides(rect1)
	const rectSides2 = getRectSides(rect2)

	let side1: RectSideType | undefined
	for (const side of rectSides1) {
		if (
			isPointOnSide(cPoint1.point, side) &&
			isAnglePerp(side, cPoint1.angle, rect1.position)
		) {
			side1 = side
			break
		}
	}

	if (!side1)
		throw new Error("Точка подсоединения или угол не подходят для rect1")

	let side2: RectSideType | undefined
	for (const side of rectSides2) {
		if (
			isPointOnSide(cPoint2.point, side) &&
			isAnglePerp(side, cPoint2.angle, rect2.position)
		) {
			side2 = side
			break
		}
	}

	if (!side2)
		throw new Error("Точка подсоединения или угол не подходят для rect2")

	return buildPath(cPoint1, cPoint2, rect1, rect2)
}
