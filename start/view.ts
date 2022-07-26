/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import View from '@ioc:Adonis/Core/View'
import { IMG_PLACEHOLDER } from 'Config/drive'

View.global('getImage', async (imgPath: string | null) => imgPath ?? IMG_PLACEHOLDER)
