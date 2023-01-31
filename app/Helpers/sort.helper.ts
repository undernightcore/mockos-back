import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Route from 'App/Models/Route'

export async function recalculateRouteOrder(routes: Route[], trx: TransactionClientContract) {
  await Promise.all(
    routes.map(async (r, index) => {
      r.useTransaction(trx)
      r.order = index + routes.length + 1
      await r.save()
    })
  )
  await Promise.all(
    routes.map(async (r, index) => {
      r.order = index + 1
      await r.save()
    })
  )
}
