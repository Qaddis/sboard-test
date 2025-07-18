import type { IRenderData, PointType, RectType } from "../types/types"

// Функция для рендера всей сцены
export const render = (canvas: HTMLCanvasElement, data: IRenderData): void => {
	// Получение контекста canvas
	const context = canvas.getContext("2d")!

	// Очищаем canvas
	context.clearRect(0, 0, canvas.width, canvas.height)

	// Рендер прямоугольников
	renderRect(context, data.rect1)
	renderRect(context, data.rect2, "orange")

	// Рендер соединяющей ломанной
	renderPath(context, data.path)

	// Рендер точек подсоединения
	renderConnPoint(context, data.cPoint1.point)
	renderConnPoint(context, data.cPoint2.point)
}

// Функция для вывода прямоугольника
const renderRect = (
	context: CanvasRenderingContext2D,
	{ position, size }: RectType,
	color: string = "blue"
): void => {
	// Координаты левого верхнего угла прямоугольника
	const x = position.x - size.width / 2
	const y = position.y - size.height / 2

	context.fillStyle = color
	context.fillRect(x, y, size.width, size.height)
}

// Функция для вывода точки подсоединения
const renderConnPoint = (
	context: CanvasRenderingContext2D,
	point: PointType,
	color: string = "red"
): void => {
	context.fillStyle = color

	context.beginPath()
	context.arc(point.x, point.y, 3, 0, Math.PI * 2)
	context.fill()
}

// Функция для вывода кривой
const renderPath = (
	context: CanvasRenderingContext2D,
	points: PointType[],
	color: string = "slategray"
): void => {
	context.strokeStyle = color
	context.lineWidth = 2

	context.beginPath()
	context.moveTo(points[0].x, points[0].y)

	for (let i = 1; i < points.length; i++) {
		context.lineTo(points[i].x, points[i].y)
	}

	context.stroke()
}
