import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'members'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.unique(['project_id', 'user_id'])
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('projects.id')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.boolean('verified').defaultTo(false)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
