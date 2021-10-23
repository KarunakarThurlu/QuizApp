import swaggerJSDoc from "swagger-jsdoc";

const oops = () => {

    console.log("calling foo ..................")

}
export default oops;

//swagger configuration in nodejs

const defination ={
    info: {
        title: 'swagger-jsdoc-nodejs',
        version: '1.0.0',
        description: 'This is a sample server'
    },
    host: 'localhost:8080',
    schemes: ['http'],
    basePath: '/api/v1',
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: {
        '/': {
            get: {
                operationId: 'get_api',
                tags: ['api'],
                parameters: [],
                responses: {
                    '200': {
                        description: 'successful operation',
                        schema: {
                            type: 'object',
                            properties: {
                                'message': {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

const swagger = swaggerJSDoc(defination);

export function getApi() {
    return new Promise((resolve, reject) => {
        swagger.then(function (api) {
            resolve(api);
        });
    });

/*
const defination = {
    openapi: "3.0.0",
    info: {
        title: "Library API",
        version: "1.0.0",
        description: "A simple Express Library API",
        termsOfService: "http://example.com/terms/",
        contact: {
            name: "API Support",
            url: "http://www.exmaple.com/support",
            email: "support@example.com",
        },
    },
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
        },
    },

    servers: [
        {
            url: "http://localhost:3001/",
            description: "My API Documentation",
        },
    ],
};
*/