const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require('path')

const app = express()
const port = process.env.PORT
const publicDirPath = path.join(__dirname, './public')

app.use(express.static(publicDirPath))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})