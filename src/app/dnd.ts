import type {
	ConnectionPointType,
	IRenderData,
	PointType,
	RectType
} from "../types/types"

// Проверка - лежит ли точка внутри прямоугольника
const isPointInRect = (
	point: PointType,
	{ position, size }: RectType
): boolean =>
	point.x >= position.x - size.width / 2 &&
	point.x <= position.x + size.width / 2 &&
	point.y >= position.y - size.height / 2 &&
	point.y <= position.y + size.height / 2

// Функция для инициализации перетаскивания
export const initDnd = (
	canvas: HTMLCanvasElement,
	data: IRenderData,
	renderFn: (data: IRenderData) => void
): void => {
	// Перетаскиваемый прямоугольник
	let targetRect: "rect1" | "rect2" | null = null
	// Координаты смещения курсора относительно координат прямоугольника
	let offset: PointType = { x: 0, y: 0 }

	// Функция для обработки нажатия кнопки мыши
	const handleMouseDown = (event: MouseEvent): void => {
		const canvasArea = canvas.getBoundingClientRect()

		// Позиция курсора относительно канваса
		const mousePos: PointType = {
			x: event.clientX - canvasArea.left,
			y: event.clientY - canvasArea.top
		}

		if (isPointInRect(mousePos, data.rect1)) {
			targetRect = "rect1"

			offset = {
				x: mousePos.x - data.rect1.position.x,
				y: mousePos.y - data.rect1.position.y
			}
		} else if (isPointInRect(mousePos, data.rect2)) {
			targetRect = "rect2"

			offset = {
				x: mousePos.x - data.rect2.position.x,
				y: mousePos.y - data.rect2.position.y
			}
		}

		if (targetRect) canvas.style.cursor = "grabbing"
	}

	// Функция для обработки движения мыши
	const handleMouseMove = (event: MouseEvent): void => {
		// Если курсор просто двигается, не перемещая прямоугольник
		if (!targetRect) return

		const canvasArea = canvas.getBoundingClientRect()

		// Новая позиция курсора учитывая позиционирование относительно канваса и смещение относительно координат прямоугольника
		const newPos: PointType = {
			x: event.clientX - canvasArea.left - offset.x,
			y: event.clientY - canvasArea.top - offset.y
		}

		// Перетаскиваемый прямоугольник
		const currRect: RectType = data[targetRect]

		// Перемещение прямоугольника
		const trans: PointType = {
			x: newPos.x - currRect.position.x,
			y: newPos.y - currRect.position.y
		}

		// Изменение координат перетаскиваемого прямоугольника
		currRect.position = newPos

		// Точка подсоединения перетаскиваемого прямоугольника
		const cPoint: ConnectionPointType =
			data[targetRect === "rect1" ? "cPoint1" : "cPoint2"]

		// Изменение координат точки подсоединения перетаскиваемого прямоугольника
		cPoint.point.x += trans.x
		cPoint.point.y += trans.y

		renderFn(data)
	}

	// Функция для обработки отпускания кнопки мыши
	const handleMouseUp = (): void => {
		targetRect = null

		canvas.style.cursor = "default"
	}

	canvas.addEventListener("mousedown", handleMouseDown)
	canvas.addEventListener("mousemove", handleMouseMove)
	canvas.addEventListener("mouseup", handleMouseUp)
	canvas.addEventListener("mouseleave", handleMouseUp)
}
