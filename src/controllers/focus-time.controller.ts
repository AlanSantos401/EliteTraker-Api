import { request, Request, Response } from "express";
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

    index = async (request: Request, response: Response) => {
        const schema = z.object({
            date: z.coerce.date(),
        })

        const validated = schema.safeParse(request.query)

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return response.status(422).json({ message: errors })
        }

        const startDate = dayjs(validated.data.date).startOf('day')
        const endDate = dayjs(validated.data.date).endOf('day')

        const focusTime = await focusTimeModel.find({
            timeFrom: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            },
        }).sort({
            timeFrom: 1,
        })

        return response.status(200).json(focusTime)
    }

    metricsByMontch = async (request: Request, response: Response) => {
        const schema = z.object({
            date: z.coerce.date(),

        })

        const validated = schema.safeParse(request.query)

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return response.status(422).json({ message: errors })
        }

        const startDate = dayjs(validated.data.date).startOf('month')
        const endDate = dayjs(validated.data.date).endOf('month')

        const focusTimesMetrics = await focusTimeModel.aggregate().match({
            timeFrom: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            }
        }).project({
            year: {
                $year: '$timeFrom',
            },
            month: {
                $month: '$timeFrom',
            },
            day: {
                $dayOfMonth: '$timeFrom',
            }
        }).group({
            _id: ['$year', '$month', '$day'],
            count: {
                $sum: 1,
            }
        }).sort({
            _id: 1,
        })

        return response.status(200).json(focusTimesMetrics)
    }

}
