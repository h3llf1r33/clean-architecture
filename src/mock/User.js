"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUser = exports.mockUsers = void 0;
var mockUsers = function (quantity) {
    return Array.from(Array(quantity).keys()).map(function (_, index) {
        var id = index + 1;
        return {
            id: String(id),
            name: "John Doe ".concat(id)
        };
    });
};
exports.mockUsers = mockUsers;
exports.mockUser = {
    id: "1",
    name: "John Doe"
};
