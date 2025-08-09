import { Request, Response } from "express";

export class HabitsController {
	private readonly habits: any[] = [];
	store = (request: Request, response: Response): Response => {
		const { name } = request.body;

		const newHabit = { name };

		this.habits.push(newHabit);

		return response.status(200).json(newHabit);
	};
}
