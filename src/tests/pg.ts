import { Sequelize } from 'sequelize'

export const client = new Sequelize('human-schema', 'postgres', 'postgres', {
	host: 'localhost',
	dialect: 'postgres'
})
