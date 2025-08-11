import { Request, Response } from "express";
import dayjs from "dayjs";
import { z } from 'zod'
import { buildValidationErrorMessage } from "../utils/build-validation-error-message.utils";
import { focusTimeModel } from "../schemas/focus-time.models";

export class FocustimeController {

    store = async (request: Request, response: Response) => {
        const schema = z.object({
            timeFrom: z.coerce.date(),
            timeTo: z.coerce.date()
        })

        const focusTime = schema.safeParse(request.body)

        if (!focusTime.success) {
            const errors = buildValidationErrorMessage(focusTime.error.issues)

            return response.status(422).json({ message: errors })
        }

        const timeFrom = dayjs(focusTime.data.timeFrom)
        const timeTo = dayjs(focusTime.data.timeTo)

        const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom)

        if (isTimeToBeforeTimeFrom) {
            return response.status(400).json({ message: "timeTo cannot be in the past." })
        }

        const createdfocusTime = await focusTimeModel.create({
            timeFrom: timeFrom.toDate(),
            timeTo: timeTo.toDate(),
        })

        return response.status(201).json(createdfocusTime)
    };

}
