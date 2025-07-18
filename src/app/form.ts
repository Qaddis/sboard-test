import type { IRenderData } from "../types/types"

/*
	Решил не использовать полноценные валидаторы для форм
	Поэтому данная функция получилась костыльной :|
	Однако в продакшн проектах, я считаю, библиотеки для валидации форм незаменимы
*/

export const updateDataViaForm = (
	form: HTMLFormElement,
	data: IRenderData,
	renderFn: (data: IRenderData) => void
): void =>
	form.addEventListener("submit", evt => {
		evt.preventDefault()

		const formData = new FormData(form)

		if (
			!formData.get("rect1_pos-x") ||
			!formData.get("rect1_pos-y") ||
			!formData.get("rect1_width") ||
			!formData.get("rect1_height") ||
			!formData.get("rect1_conn-x") ||
			!formData.get("rect1_conn-y") ||
			!formData.get("rect1_conn-a")
		)
			throw new Error("Вы ввели некорректные данные для первого прямоугольника")

		data.rect1 = {
			position: {
				x: Number(formData.get("rect1_pos-x")),
				y: Number(formData.get("rect1_pos-y"))
			},
			size: {
				width: Number(formData.get("rect1_width")),
				height: Number(formData.get("rect1_height"))
			}
		}

		data.cPoint1 = {
			point: {
				x: Number(formData.get("rect1_conn-x")),
				y: Number(formData.get("rect1_conn-y"))
			},
			angle: Number(formData.get("rect1_conn-a"))
		}

		if (
			!formData.get("rect2_pos-x") ||
			!formData.get("rect2_pos-y") ||
			!formData.get("rect2_width") ||
			!formData.get("rect2_height") ||
			!formData.get("rect2_conn-x") ||
			!formData.get("rect2_conn-y") ||
			!formData.get("rect2_conn-a")
		)
			throw new Error("Вы ввели некорректные данные для второго прямоугольника")

		data.rect2 = {
			position: {
				x: Number(formData.get("rect2_pos-x")),
				y: Number(formData.get("rect2_pos-y"))
			},
			size: {
				width: Number(formData.get("rect2_width")),
				height: Number(formData.get("rect2_height"))
			}
		}

		data.cPoint2 = {
			point: {
				x: Number(formData.get("rect2_conn-x")),
				y: Number(formData.get("rect2_conn-y"))
			},
			angle: Number(formData.get("rect2_conn-a"))
		}

		renderFn(data)
	})
