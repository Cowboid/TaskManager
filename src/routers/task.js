const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try {
        await task.save()
        res.send(201)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/tasks', auth, async (req, res) => {
    
    try {
        const tasks = await Task.find({owner: req.user._id, completed: false})
        res.send(tasks)
    } catch (e) {
        res.status(404).send()
    }
})

//Delete task
router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            throw new Error('This task does not exist.')
        }

        res.send('Task deleted.')

    } catch (e) {
        res.status(404).send(e.message)
    }
})

//Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    console.log(req.params.id)
    console.log(req.body)
    const validUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every(update => {
        return validUpdates.includes(update)
    })
    
    try {

        if (!isValidOperation) {
            throw new Error()
        }

        await Task.findOneAndUpdate({_id: req.params.id, owner: req.user._id}, req.body)
        res.send('Task updated.')
    
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router