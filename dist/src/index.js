"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async fetch(request) {
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }
        return new Response(JSON.stringify({
            message: "API is working ✅"
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    },
};
//# sourceMappingURL=index.js.map