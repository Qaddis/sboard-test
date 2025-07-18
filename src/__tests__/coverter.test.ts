import { dataConverter } from "../app/converter"
import type { ConnectionPointType, RectType } from "../types/types"

// Тестовые данные
const rect1: RectType = {
	position: { x: 100, y: 100 },
	size: { width: 80, height: 80 }
}

const rect2: RectType = {
	position: { x: 300, y: 200 },
	size: { width: 80, height: 80 }
}

// Простенький хэлпер
const getConnPoint = (
	x: number,
	y: number,
	angle: number
): ConnectionPointType => {
	return {
		point: {
			x,
			y
		},
		angle
	}
}

// Тестирование основного алгоритма
describe("dataConverter()", () => {
	it("build path from right side of rect1 to left side if rect2", () => {
		const cPoint1 = getConnPoint(140, 80, 0)
		const cPoint2 = getConnPoint(260, 220, 180)

		const out = dataConverter(rect1, rect2, cPoint1, cPoint2)

		expect(Array.isArray(out)).toBe(true)
		expect(out.length).toBeGreaterThan(1)
	})

	it("build path between the lower sides of two rectangles", () => {
		const cPoint1 = getConnPoint(100, 140, 90)
		const cPoint2 = getConnPoint(300, 240, 90)

		const out = dataConverter(rect1, rect2, cPoint1, cPoint2)

		expect(Array.isArray(out)).toBe(true)
		expect(out.length).toBeGreaterThan(1)
	})

	it("throws if connection point not on rect side", () => {
		const cPoint1 = getConnPoint(350, 80, 0)
		const cPoint2 = getConnPoint(260, 220, 180)

		expect(() => dataConverter(rect1, rect2, cPoint1, cPoint2)).toThrow(
			"Точка подсоединения или угол не подходят для rect1"
		)
	})

	it("throws if angle of cPoint2 is incorrect", () => {
		const cPoint1 = getConnPoint(140, 80, 0)
		const cPoint2 = getConnPoint(260, 220, 0)

		expect(() => dataConverter(rect1, rect2, cPoint1, cPoint2)).toThrow(
			"Точка подсоединения или угол не подходят для rect2"
		)
	})
})
