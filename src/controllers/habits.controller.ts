import { Request, Response } from "express";
import { z } from 'zod'
import { habitModel } from "../schemas/habit.model";
import { buildValidationErrorMessage } from "../utils/build-validation-error-message.utils";

export class HabitsController {
	private readonly habits: any[] = [];
	store = async (request: Request, response: Response): Promise<Response> => {
		const schema = z.object({
			name: z.string(),
		
		})

		const habit = schema.safeParse(request.body)

		if (!habit.success) {
			const errors = buildValidationErrorMessage(habit.error.issues)

			return response.status(422).json({ message: errors });
		}

		const findHabit = await habitModel.findOne({
			name: habit.data.name
		})

		if (findHabit) {
			return response.status(400).json({ message: "Habit already exists." })
		}

		const newHabit = await habitModel.create({
			name: habit.data.name,
			completedDates: []
		})

		this.habits.push(newHabit);

		return response.status(200).json(newHabit);
	};
}
