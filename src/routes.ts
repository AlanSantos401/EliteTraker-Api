import { Router } from "express";
import packageJson from "../package.json";
import { HabitsController } from "./controllers/habits.controller";
import { FocustimeController } from "./controllers/focus-time.controller";


export const routes = Router();

const habitsController = new HabitsController();
const focusTimeController = new FocustimeController();


routes.get("/", (request, response) => {
	const { name, description, version } = packageJson;
	return response.status(200).json({ name, description, version });
});

routes.post("/habits", habitsController.store);
routes.get("/habits", habitsController.index);
routes.delete("/habits/:id", habitsController.remove);
routes.patch("/habits/:id/toggle", habitsController.toggle);
routes.post('/focus-time', focusTimeController.store)
