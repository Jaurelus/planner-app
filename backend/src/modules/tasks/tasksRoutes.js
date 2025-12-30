import { editTask, deleteTask, addTask, viewAllTasks } from "./tasksController";

const router = new Router();

router.post("/", addTask);
router.delete("/:id", deleteTask);
router.put("/:id", editTask);
router.get(":/", viewAllTasks);

export default router;
