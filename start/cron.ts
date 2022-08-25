/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

// * Types
import type { Err } from 'Contracts/response'
// * Types

import cron from 'node-cron'
import RouteService from 'App/Services/RouteService'
import CargoService from 'App/Services/Cargo/CargoService'
import { archiving } from 'Config/app'

if (archiving.cargo || archiving.routes) {

  const period: string = '0 9 * * *' // Every day at 09:00 AM

  cron.schedule(period, async () => {
    try {

      if (archiving.cargo)
        await CargoService.archiveOldRows(archiving.cargo)

      if (archiving.routes)
        await RouteService.archiveOldRows(archiving.routes)

    } catch (err: Err | any) {} // Catch the error, and do nothing
  })

}
