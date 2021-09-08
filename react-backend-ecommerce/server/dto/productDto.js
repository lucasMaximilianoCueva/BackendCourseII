const productDto = (producto) => {
    return myDto = {
      fyh: new Date().toLocaleString(),
      producto: producto.title,
      precio: producto.price,
      imagen: producto.thumbnail,
    };
  };
export default productDto;  