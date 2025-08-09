import { Request, Response } from "express";
import { habitModel } from "../schemas/habit.model";

export class HabitsController {
	private readonly habits: any[] = [];
	store = async (request: Request, response: Response): Promise<Response> => {
		const { name } = request.body;

		const newHabit = await habitModel.create({
			name,
			completedDates: []
		})

		this.habits.push(newHabit);

		return response.status(200).json(newHabit);
	};
}
