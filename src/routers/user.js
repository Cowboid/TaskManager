const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
require('../db/mongoose')

const router = new express.Router()

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.append('Authorization', token)
        res.location('http://localhost:3000/app.html')
        res.status(200).send()
    } catch (e) {
        res.status(404).send(e)
    }
})

router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        const token = await user.generateToken()
        await user.save()
        res.append('Authorization', token)
        res.status(201).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })
    await req.user.save()
    res.send('Logged out!')
})

router.post('/users/logoutAll', auth, async (req, res) => {
    console.log('yes')
    try {
        console.log(req.user)
        req.user.tokens = []
        const user = await req.user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/users/me', auth, async (req, res) => {
    const validUpdates = ['password', 'email', 'name']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every(update => {
        return validUpdates.includes(update)
    })

    try {

        if (!isValidOperation) {
            throw new Error()
        }

        updates.forEach(update => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.send('Updates applied.')

    } catch(e) {
        res.status(400).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        const user = await req.user.remove()
        res.send('Your account has been deleted.')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router