import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Project from 'App/Models/Project'

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column({ serializeAs: null })
  public projectId: number

  @column({ serializeAs: null })
  public userId: number

  @column()
  public verified: boolean
}
