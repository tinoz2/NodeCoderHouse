const fs = require('fs/promises');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    async addProduct(product) {
        const productId = this.products.length + 1;
        const newProduct = { id: productId, ...product };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    async updateProduct(productId, updatedProduct) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            updatedProduct.id = productId;
            this.products[index] = updatedProduct;
            await this.saveProducts();
            return updatedProduct;
        } else {
            throw new Error('Producto no encontrado');
        }
    }

    async deleteProduct(productId) {
        this.products = this.products.filter(product => product.id !== productId);
        await this.saveProducts();
    }
}

const productManager = new ProductManager('products.json');

module.exports = ProductManager;
