import swaggerJsDoc from "swagger-jsdoc"

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hackathon API Documentation",
            version: "1.0.0",
            description: "API documentation for managing authentication, products, and orders",
        },
        servers: [
            {
                url: "https://gorgeous-bernelle-abdul-moiz-ali-5539400c.koyeb.app", // Replace with your deployed URL
                description: "Production Server",
            },
            {
                url: "http://localhost:4000", // Localhost for development
                description: "Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", // JSON Web Token
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "User ID",
                        },
                        name: {
                            type: "string",
                            description: "User name",
                        },
                        email: {
                            type: "string",
                            description: "User email",
                        },
                        password: {
                            type: "string",
                            description: "User password",
                        },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Product ID",
                        },
                        name: {
                            type: "string",
                            description: "Product name",
                        },
                        description: {
                            type: "string",
                            description: "Product description",
                        },
                        price: {
                            type: "number",
                            description: "Product price",
                        },
                        image: {
                            type: "string",
                            description: "Product image URL",
                        },
                        user: {
                            $ref: "#/components/schemas/User",
                        },
                    },
                },
                Order: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Order ID",
                        },
                        user: {
                            $ref: "#/components/schemas/User",
                        },
                        products: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Product",
                            },
                        },
                        totalPrice: {
                            type: "number",
                            description: "Total price of the order",
                        },
                        status: {
                            type: "string",
                            enum: ["pending", "completed", "shipped"],
                            description: "Order status",
                        },
                        orderDate: {
                            type: "string",
                            format: "date-time",
                            description: "Date when the order was placed",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.js"], // Adjust path if needed
};


const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec
