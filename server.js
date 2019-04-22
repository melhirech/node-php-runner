const express = require('express')
const app = express()
const exec = require('child_process').exec

/* 

.heroku/php/bin/php

===============
You'll need to inform the build API that you'd like to use multiple buildpacks. Try:

$ heroku buildpacks:clear
$ heroku buildpacks:add heroku/php
$ heroku buildpacks:add heroku/nodejs

Then you can inspect the compiled slug via heroku run bash to verify that the bins are where you expect them to be.
===============

*/


const PORT = process.env.PORT || 3000

app.enable('trust proxy')

app.get('/', (req, res) => {
    const PHP_PATH = req.query.path

    execPHP(PHP_PATH).then(result => {
        res.send(result)
    }).catch(err => {
        res.send(err)
    })


})

app.get('/ip', (req, res) => {
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || ':('
    res.send({
        xForwardedFor: req.headers['x-forwarded-for'],
        remoteAddress: req.connection.remoteAddress,
        reqIP: req.ip
    })
})

const execPHP = (phpPath) => {

    /*     const paramsToBase64 = params.map(param => {
            return Buffer.from(JSON.stringify(param)).toString("base64")
        }) */

    const command = `${phpPath} -q ./test.php `

    return new Promise((resolve, reject) => {
        exec(command,
            (error, stdout, stderr) => {
                if (!error) {
                    return resolve(stdout)
                }
                return reject({ error, stderr })
            })
    })


}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
