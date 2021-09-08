const productDto = (product) => {
    return Dto = {
      date: new Date().toLocaleString(),
      product: product.title,
      price: product.price,
      image: product.thumbnail,
    };
  };
export default productDto;  