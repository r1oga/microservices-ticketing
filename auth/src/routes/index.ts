const { Router } = require('express')

const router = Router()

router.get('/', (_,res) => res.status(200).send({message: 'ON'}))

module.exports = router