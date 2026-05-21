import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.boolean('favorite').notNullable().defaultTo(false)
      table.string('color').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('title')
      table.dropColumn('description')
      table.dropColumn('favorite')
      table.dropColumn('color')
    })
  }
}