import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();



router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({  });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  console.log(req.body);
  const task = new Task(req.body);
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get('/:id', async (req, res) => {

  
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).send(task)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    console.log(req.body);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    //console.log(req.body);
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;