# Cloud Pharma - Tienda Farmacéutica
### `react-commerce-app`
<br />



## Este Proyecto fué desarrollado en [React](https://es.reactjs.org/) para el Final de curso dictado en [CoderHouse](https://www.coderhouse.com/).  
#### Actualmente se encuentra en una versión estable, aún así planeo seguir desarrollando algunas features extras
<br/>

### `Antes De Iniciar El Proyecto Ejecutar:`
```
npm install
```
### `Para Inicilizar El Proyecto Ejecutar:`
```
npm start
```
**Estilos**

Utilicé el preprocesador [Sass](https://create-react-app.dev/docs/adding-a-sass-stylesheet/) ya que me sentía cómodo con el entorno de trabajo y preferí dar yo los estilos a usar una librería en este caso. En el caso del Nav utilicé [styled-components](https://styled-components.com/). Añadidos también algunas animaciones con css en el RightNav y button. Las imágenes son traidas de internet, por lo que no se visualizarán offline.

**Navegación**

Para la navegación entre los distintos componentes de la App utilicé [react-router-dom](https://reactrouter.com/web/guides/quick-start), cambia la Url del navegador, modifica el historial y mantiene sincronizado el estado de la interfaz de usuario.

**Firestore**

Conectada una colección de firestore con el listado de items y con el detalle del mismo, si navegamos a /item/:id podremos hacer una consulta de un documento en específico, asi como tambien podemos filtrar la lista de items por categoria (:categoryId).<br />Mediante la escritura en firestore podremos insertar una orden dentro de una colección y darle al user su id de orden auto-generada.

### `Página Principal`

Se visualiza en la NavBar a la izquierda el logo de la marca, a la derecha el CartWidget solo si contiene almenos 1 item, y un menú desplegable que contiene atajos y categorías. Por debajo el banner con el nombre de la marca y dos clickeables que muestran diferentes productos en la lista.<br />
ItemListContainer muestra una lista de items traidos de la colección de firestore.

### `Detalle Del Producto`

Al clickear en un item en la vista principal nos redireccionara al componente ItemDetailContainer, el cual vuelve a traer los items de firestore pero solo trae al que coincida con el id clickeado anteriormente, en el caso que no coincida muestra un mensaje de error.<br/>
Podemos seleccionar la cantidad del item que queremos agregar a nuestro cart, en el caso que se supere la cantidad del stock muestra un mensaje de alerta e impide seguir sumando. Clickeamos agregar y a terminar compra, nos lleva al componente Cart.

### `Carrito De Compras`

Aquí se puede visualizar una lista de los productos añadidos, con su título, cantidad por item, su precio, cantidad total (visualizada en el CartWidget) y precio total. Hay un boton para eliminar individualmente y otro para vaciar el carrito, a la derecha un breve formulario que luego va a servir para crear una orden y al clickear 'checkout' nos va a devolver el orderId. El carrito se reinicia y podemos volver a repetir el proceso.

### A Futuro pienso añadirle un auth/login y un carrito que sea persistente con localStorage.

<br/>

