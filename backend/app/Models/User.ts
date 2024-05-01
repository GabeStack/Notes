import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import LinkToken from './LinkToken'
import Note from './Note'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public username: string
  @column()
  public email: string
  @column({ serializeAs: null}) 
  public password: string
  @column()
  public avatar: string
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => LinkToken, {
    foreignKey: 'userId'
  })
  public tokens : HasMany<typeof LinkToken>

  @hasMany(() => Note, {
    foreignKey: 'userId'
  })
  public notes : HasMany<typeof Note>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
