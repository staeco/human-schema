import { Sequelize } from 'sequelize'

const client = process.env.NO_DB
	? null
	: new Sequelize('human-schema', 'postgres', 'postgres', {
		host: 'localhost',
		dialect: 'postgres'
	})

export { client }