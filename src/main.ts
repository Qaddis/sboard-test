import { dataConverter } from "./app/converter"
import { initDnd } from "./app/dnd"
import { updateDataViaForm } from "./app/form"
import { render } from "./app/render"
import type { IRenderData } from "./types/types"

// Тестовые данные
import { cPoint1, cPoint2, rect1, rect2 } from "./data"

// Родительский элемент для canvas
const container = document.querySelector<HTMLDivElement>(".container")!

// Форма для быстрого обновления данных
const form = document.getElementById("form")! as HTMLFormElement

// Создание canvas
const canvas = document.createElement("canvas")

canvas.width = container.clientWidth
canvas.height = 600

container.appendChild(canvas)

// Данные для отрисовки
const appData: IRenderData = {
	rect1,
	rect2,
	cPoint1,
	cPoint2,
	path: []
}

// Функция для перерисовки данных на canvas
export const update = (data: IRenderData) => {
	try {
		data.path = dataConverter(
			data.rect1,
			data.rect2,
			data.cPoint1,
			data.cPoint2
		)
	} catch (error) {
		console.error(error)
	}

	if (appData.path.length > 0) render(canvas, data)
}

// Быстрое обновление данных с помощи формы form
updateDataViaForm(form, appData, update)

// Инициализация перетаскивания прямоугольников
initDnd(canvas, appData, update)

// Первая отрисовка с тестовыми данными
update(appData)
