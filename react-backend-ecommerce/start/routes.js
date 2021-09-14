'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('welcome')

Route.get('/', () => 'Hola mama! estoy programando!');

Route.get("/products", "ProductController.index");
Route.get("/products/:id", "ProductController.detail");
Route.post('/products', 'ProductController.post')
Route.put('/products/:id', 'ProductController.put')
Route.delete('/products/:id', 'ProductController.delete')
