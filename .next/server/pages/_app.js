/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./config/api.ts":
/*!***********************!*\
  !*** ./config/api.ts ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   API_BASE_URL: () => (/* binding */ API_BASE_URL),\n/* harmony export */   apiClient: () => (/* binding */ apiClient),\n/* harmony export */   getApiUrl: () => (/* binding */ getApiUrl)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);\naxios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\nconst API_BASE_URL = \"https://api.tusecreto.net\";\nconst getApiUrl = (endpoint)=>{\n    // Remove leading slash if present to avoid double slashes\n    const cleanEndpoint = endpoint.startsWith(\"/\") ? endpoint.slice(1) : endpoint;\n    return `${API_BASE_URL}/${cleanEndpoint}`;\n};\n// Axios instance with proper configuration\n\nconst apiClient = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({\n    baseURL: API_BASE_URL,\n    withCredentials: true,\n    headers: {\n        \"Content-Type\": \"application/json\"\n    }\n});\n// Configure axios defaults for all requests\naxios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].defaults.withCredentials = true;\n// Add request interceptor to handle authentication\napiClient.interceptors.request.use((config)=>{\n    // Add any auth tokens or headers here if needed\n    return config;\n});\n// Add response interceptor to handle errors\napiClient.interceptors.response.use((response)=>response, (error)=>{\n    console.error(\"API Error:\", error);\n    return Promise.reject(error);\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb25maWcvYXBpLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBTyxNQUFNQSxlQUFlLDRCQUE0QjtBQUVqRCxNQUFNQyxZQUFZLENBQUNDO0lBQ3hCLDBEQUEwRDtJQUMxRCxNQUFNQyxnQkFBZ0JELFNBQVNFLFVBQVUsQ0FBQyxPQUFPRixTQUFTRyxLQUFLLENBQUMsS0FBS0g7SUFDckUsT0FBTyxDQUFDLEVBQUVGLGFBQWEsQ0FBQyxFQUFFRyxjQUFjLENBQUM7QUFDM0MsRUFBRTtBQUVGLDJDQUEyQztBQUNqQjtBQUVuQixNQUFNSSxZQUFZRCxvREFBWSxDQUFDO0lBQ3BDRyxTQUFTVDtJQUNUVSxpQkFBaUI7SUFDakJDLFNBQVM7UUFDUCxnQkFBZ0I7SUFDbEI7QUFDRixHQUFHO0FBRUgsNENBQTRDO0FBQzVDTCxzREFBYyxDQUFDSSxlQUFlLEdBQUc7QUFFakMsbURBQW1EO0FBQ25ESCxVQUFVTSxZQUFZLENBQUNDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUNDO0lBQ2xDLGdEQUFnRDtJQUNoRCxPQUFPQTtBQUNUO0FBRUEsNENBQTRDO0FBQzVDVCxVQUFVTSxZQUFZLENBQUNJLFFBQVEsQ0FBQ0YsR0FBRyxDQUNqQyxDQUFDRSxXQUFhQSxVQUNkLENBQUNDO0lBQ0NDLFFBQVFELEtBQUssQ0FBQyxjQUFjQTtJQUM1QixPQUFPRSxRQUFRQyxNQUFNLENBQUNIO0FBQ3hCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHVzZWNyZXRvLWZyb250ZW5kLy4vY29uZmlnL2FwaS50cz8zMTllIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBBUElfQkFTRV9VUkwgPSAnaHR0cHM6Ly9hcGkudHVzZWNyZXRvLm5ldCc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QXBpVXJsID0gKGVuZHBvaW50OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gIC8vIFJlbW92ZSBsZWFkaW5nIHNsYXNoIGlmIHByZXNlbnQgdG8gYXZvaWQgZG91YmxlIHNsYXNoZXNcclxuICBjb25zdCBjbGVhbkVuZHBvaW50ID0gZW5kcG9pbnQuc3RhcnRzV2l0aCgnLycpID8gZW5kcG9pbnQuc2xpY2UoMSkgOiBlbmRwb2ludDtcclxuICByZXR1cm4gYCR7QVBJX0JBU0VfVVJMfS8ke2NsZWFuRW5kcG9pbnR9YDtcclxufTtcclxuXHJcbi8vIEF4aW9zIGluc3RhbmNlIHdpdGggcHJvcGVyIGNvbmZpZ3VyYXRpb25cclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuXHJcbmV4cG9ydCBjb25zdCBhcGlDbGllbnQgPSBheGlvcy5jcmVhdGUoe1xyXG4gIGJhc2VVUkw6IEFQSV9CQVNFX1VSTCxcclxuICB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXHJcbiAgaGVhZGVyczoge1xyXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICB9LFxyXG59KTtcclxuXHJcbi8vIENvbmZpZ3VyZSBheGlvcyBkZWZhdWx0cyBmb3IgYWxsIHJlcXVlc3RzXHJcbmF4aW9zLmRlZmF1bHRzLndpdGhDcmVkZW50aWFscyA9IHRydWU7XHJcblxyXG4vLyBBZGQgcmVxdWVzdCBpbnRlcmNlcHRvciB0byBoYW5kbGUgYXV0aGVudGljYXRpb25cclxuYXBpQ2xpZW50LmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZSgoY29uZmlnKSA9PiB7XHJcbiAgLy8gQWRkIGFueSBhdXRoIHRva2VucyBvciBoZWFkZXJzIGhlcmUgaWYgbmVlZGVkXHJcbiAgcmV0dXJuIGNvbmZpZztcclxufSk7XHJcblxyXG4vLyBBZGQgcmVzcG9uc2UgaW50ZXJjZXB0b3IgdG8gaGFuZGxlIGVycm9yc1xyXG5hcGlDbGllbnQuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShcclxuICAocmVzcG9uc2UpID0+IHJlc3BvbnNlLFxyXG4gIChlcnJvcikgPT4ge1xyXG4gICAgY29uc29sZS5lcnJvcignQVBJIEVycm9yOicsIGVycm9yKTtcclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgfVxyXG4pO1xyXG4iXSwibmFtZXMiOlsiQVBJX0JBU0VfVVJMIiwiZ2V0QXBpVXJsIiwiZW5kcG9pbnQiLCJjbGVhbkVuZHBvaW50Iiwic3RhcnRzV2l0aCIsInNsaWNlIiwiYXhpb3MiLCJhcGlDbGllbnQiLCJjcmVhdGUiLCJiYXNlVVJMIiwid2l0aENyZWRlbnRpYWxzIiwiaGVhZGVycyIsImRlZmF1bHRzIiwiaW50ZXJjZXB0b3JzIiwicmVxdWVzdCIsInVzZSIsImNvbmZpZyIsInJlc3BvbnNlIiwiZXJyb3IiLCJjb25zb2xlIiwiUHJvbWlzZSIsInJlamVjdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./config/api.ts\n");

/***/ }),

/***/ "./contexts/ThemeContext.tsx":
/*!***********************************!*\
  !*** ./contexts/ThemeContext.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction ThemeProvider({ children }) {\n    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"dark\");\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const savedTheme = localStorage.getItem(\"theme\");\n        if (savedTheme) {\n            setTheme(savedTheme);\n        }\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        localStorage.setItem(\"theme\", theme);\n        document.documentElement.className = theme;\n    }, [\n        theme\n    ]);\n    const toggleTheme = ()=>{\n        setTheme((prev)=>prev === \"dark\" ? \"light\" : \"dark\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            theme,\n            toggleTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\polic\\\\OneDrive\\\\Desktop\\\\tusecreto\\\\frontend\\\\contexts\\\\ThemeContext.tsx\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, this);\n}\nfunction useTheme() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n    if (context === undefined) {\n        throw new Error(\"useTheme must be used within a ThemeProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9UaGVtZUNvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBaUY7QUFTakYsTUFBTUksNkJBQWVKLG9EQUFhQSxDQUErQks7QUFFMUQsU0FBU0MsY0FBYyxFQUFFQyxRQUFRLEVBQTJCO0lBQ2pFLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHUCwrQ0FBUUEsQ0FBUTtJQUUxQ0MsZ0RBQVNBLENBQUM7UUFDUixNQUFNTyxhQUFhQyxhQUFhQyxPQUFPLENBQUM7UUFDeEMsSUFBSUYsWUFBWTtZQUNkRCxTQUFTQztRQUNYO0lBQ0YsR0FBRyxFQUFFO0lBRUxQLGdEQUFTQSxDQUFDO1FBQ1JRLGFBQWFFLE9BQU8sQ0FBQyxTQUFTTDtRQUM5Qk0sU0FBU0MsZUFBZSxDQUFDQyxTQUFTLEdBQUdSO0lBQ3ZDLEdBQUc7UUFBQ0E7S0FBTTtJQUVWLE1BQU1TLGNBQWM7UUFDbEJSLFNBQVNTLENBQUFBLE9BQVFBLFNBQVMsU0FBUyxVQUFVO0lBQy9DO0lBRUEscUJBQ0UsOERBQUNkLGFBQWFlLFFBQVE7UUFBQ0MsT0FBTztZQUFFWjtZQUFPUztRQUFZO2tCQUNoRFY7Ozs7OztBQUdQO0FBRU8sU0FBU2M7SUFDZCxNQUFNQyxVQUFVckIsaURBQVVBLENBQUNHO0lBQzNCLElBQUlrQixZQUFZakIsV0FBVztRQUN6QixNQUFNLElBQUlrQixNQUFNO0lBQ2xCO0lBQ0EsT0FBT0Q7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL3R1c2VjcmV0by1mcm9udGVuZC8uL2NvbnRleHRzL1RoZW1lQ29udGV4dC50c3g/OTI1NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlRWZmZWN0LCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCdcclxuXHJcbnR5cGUgVGhlbWUgPSAnbGlnaHQnIHwgJ2RhcmsnXHJcblxyXG5pbnRlcmZhY2UgVGhlbWVDb250ZXh0VHlwZSB7XHJcbiAgdGhlbWU6IFRoZW1lXHJcbiAgdG9nZ2xlVGhlbWU6ICgpID0+IHZvaWRcclxufVxyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxUaGVtZUNvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGhlbWVQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9KSB7XHJcbiAgY29uc3QgW3RoZW1lLCBzZXRUaGVtZV0gPSB1c2VTdGF0ZTxUaGVtZT4oJ2RhcmsnKVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3Qgc2F2ZWRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0aGVtZScpIGFzIFRoZW1lXHJcbiAgICBpZiAoc2F2ZWRUaGVtZSkge1xyXG4gICAgICBzZXRUaGVtZShzYXZlZFRoZW1lKVxyXG4gICAgfVxyXG4gIH0sIFtdKVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgdGhlbWUpXHJcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lID0gdGhlbWVcclxuICB9LCBbdGhlbWVdKVxyXG5cclxuICBjb25zdCB0b2dnbGVUaGVtZSA9ICgpID0+IHtcclxuICAgIHNldFRoZW1lKHByZXYgPT4gcHJldiA9PT0gJ2RhcmsnID8gJ2xpZ2h0JyA6ICdkYXJrJylcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHRoZW1lLCB0b2dnbGVUaGVtZSB9fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9UaGVtZUNvbnRleHQuUHJvdmlkZXI+XHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlVGhlbWUoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KVxyXG4gIGlmIChjb250ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWUgbXVzdCBiZSB1c2VkIHdpdGhpbiBhIFRoZW1lUHJvdmlkZXInKVxyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59Il0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJUaGVtZUNvbnRleHQiLCJ1bmRlZmluZWQiLCJUaGVtZVByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ0aGVtZSIsInNldFRoZW1lIiwic2F2ZWRUaGVtZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGFzc05hbWUiLCJ0b2dnbGVUaGVtZSIsInByZXYiLCJQcm92aWRlciIsInZhbHVlIiwidXNlVGhlbWUiLCJjb250ZXh0IiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./contexts/ThemeContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/ThemeContext */ \"./contexts/ThemeContext.tsx\");\n/* harmony import */ var _config_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/api */ \"./config/api.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_config_api__WEBPACK_IMPORTED_MODULE_3__]);\n_config_api__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n // Import API configuration\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__.ThemeProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\polic\\\\OneDrive\\\\Desktop\\\\tusecreto\\\\frontend\\\\pages\\\\_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\polic\\\\OneDrive\\\\Desktop\\\\tusecreto\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUE4QjtBQUUwQjtBQUNsQyxDQUFDLDJCQUEyQjtBQUVuQyxTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHFCQUNFLDhEQUFDSCxpRUFBYUE7a0JBQ1osNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90dXNlY3JldG8tZnJvbnRlbmQvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHRzL1RoZW1lQ29udGV4dCdcbmltcG9ydCAnLi4vY29uZmlnL2FwaScgLy8gSW1wb3J0IEFQSSBjb25maWd1cmF0aW9uXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPFRoZW1lUHJvdmlkZXI+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9UaGVtZVByb3ZpZGVyPlxuICApXG59Il0sIm5hbWVzIjpbIlRoZW1lUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();