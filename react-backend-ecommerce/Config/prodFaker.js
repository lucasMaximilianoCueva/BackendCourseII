import faker from 'faker';

export class ProdFaker {
    constructor() {
        this.products = [];
        this.prodId = 1;
        this.generateProducts = () => {
            return {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                thumbnail: faker.image.image(),
                _id: this.prodId++
            }
        }
    }

    populate(n = 10) { //valor por defecto
        for (let i = 0; i < n; i++) {
            this.products.push(this.generateProducts())
        }
    }

    list() {
        return [... this.products]
    };

    listById(id) {
        return this.products.find(p => p._id == id)
    };

    insert(items) {
        this.products.push(items)
    };

    updateById(id, data) {
        const index = this.products.findIndex(p => p._id == id)
        if (index === -1) {
            //
        } else {
            const updatedProd = { ...this.products[index], ...data }
            this.products[index] = updatedProd;
        }
    };

    deleteById(id) {
        const index = this.products.findIndex(p => p._id === id)
        if (index === -1) {
            //
        } else {
            this.products.splice(index, 1);
        }
    };
}

const prodFaker = new ProdFaker();

export { prodFaker };