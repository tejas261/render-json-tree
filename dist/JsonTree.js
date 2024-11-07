"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTree = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var colorPalette_1 = require("./colorPalette");
var JsonTree = function (_a) {
    var data = _a.data, width = _a.width, _b = _a.theme, theme = _b === void 0 ? "light" : _b, backgroundColor = _a.backgroundColor, keyTextColor = _a.keyTextColor, valueTextColor = _a.valueTextColor, fontSize = _a.fontSize, fontStyle = _a.fontStyle;
    // Apply color scheme based on theme, falling back to specific props if provided
    var selectedColors = colorPalette_1.colorSchemes[theme];
    var appliedBackgroundColor = backgroundColor || selectedColors.backgroundColor;
    var appliedKeyTextColor = keyTextColor || selectedColors.keyTextColor;
    var appliedValueTextColor = valueTextColor || selectedColors.valueTextColor;
    var _c = (0, react_1.useState)(false), isTooltipVisible = _c[0], setIsTooltipVisible = _c[1];
    var _d = (0, react_1.useState)(data), jsonData = _d[0], setJsonData = _d[1];
    var _e = (0, react_1.useState)(null), editingKey = _e[0], setEditingKey = _e[1];
    var _f = (0, react_1.useState)(""), editingValue = _f[0], setEditingValue = _f[1];
    var _g = (0, react_1.useState)({}), expandedKeys = _g[0], setExpandedKeys = _g[1];
    var _h = (0, react_1.useState)(null), hoveredKey = _h[0], setHoveredKey = _h[1];
    var _j = (0, react_1.useState)(""), newKey = _j[0], setNewKey = _j[1];
    var _k = (0, react_1.useState)(""), newValue = _k[0], setNewValue = _k[1];
    var _l = (0, react_1.useState)(false), editingField = _l[0], setEditingField = _l[1];
    var handleEdit = function (key, value) {
        setEditingKey(key);
        setEditingValue(value);
    };
    var handleChange = function (e) {
        setEditingValue(e.target.value);
    };
    var handleBlur = function (key) {
        var keys = key.split(".");
        var current = jsonData;
        for (var i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        // Get the original value type for the current key
        var originalValue = current[keys[keys.length - 1]];
        var newValue;
        // Determine the type and parse accordingly
        if (typeof originalValue === "number") {
            newValue = Number(editingValue); // Convert to number
        }
        else if (typeof originalValue === "boolean") {
            newValue = editingValue.toLowerCase() === "true"; // Convert to boolean
        }
        else {
            newValue = editingValue; // Keep as string
        }
        current[keys[keys.length - 1]] = newValue;
        setJsonData(__assign({}, jsonData));
        setEditingKey(null);
        setEditingValue("");
    };
    var toggleExpand = function (key) {
        setExpandedKeys(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[key] = !prevState[key], _a)));
        });
    };
    var copyToClipboard = function () {
        var contentToCopy = JSON.stringify(jsonData, null, 2);
        navigator.clipboard
            .writeText(contentToCopy)
            .then(function () { return console.log("Content copied to clipboard"); })
            .catch(function (err) { return console.error("Failed to copy: ", err); });
    };
    var handleAddNewField = function (parentKey) {
        var keys = parentKey.split(".");
        var current = jsonData;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            current = current[key];
        }
        if (Array.isArray(current)) {
            current.push({ key: newKey, value: newValue });
        }
        else {
            current[newKey] = newValue;
        }
        setJsonData(__assign({}, jsonData));
        setNewKey("");
        setNewValue("");
        setHoveredKey(null);
        setEditingField(false);
    };
    var renderTree = function (data, parentKey) {
        if (parentKey === void 0) { parentKey = ""; }
        return Object.keys(data)
            .filter(function (key) { return key !== "position"; })
            .map(function (key, keyIndex) {
            var fullKey = parentKey ? "".concat(parentKey, ".").concat(key) : key;
            var isExpanded = expandedKeys[fullKey];
            var isObject = typeof data[key] === "object" && data[key] !== null;
            return ((0, jsx_runtime_1.jsx)("div", { style: {
                    marginLeft: "14px",
                    marginBottom: "5px",
                    backgroundColor: appliedBackgroundColor,
                }, onMouseEnter: function () { return setHoveredKey(fullKey); }, onMouseLeave: function () { return setHoveredKey(null); }, children: (0, jsx_runtime_1.jsx)("div", { children: isObject ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                }, onClick: function () { return toggleExpand(fullKey); }, children: [isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { color: "#B8B8B8", size: 16 })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { color: "#B8B8B8", size: 16 })), (0, jsx_runtime_1.jsx)("h1", { style: {
                                            fontSize: fontSize || "1rem",
                                            lineHeight: "1.25rem",
                                            fontWeight: 700,
                                            paddingLeft: "0.5rem",
                                            color: appliedKeyTextColor,
                                        }, children: key }), hoveredKey === fullKey && ((0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { style: {
                                            cursor: "pointer",
                                            marginLeft: "4px",
                                        }, color: "".concat(theme == "dark" ? "#fff" : "#000"), size: 16, onClick: function () {
                                            setEditingField(true);
                                            setEditingKey(fullKey);
                                        } }))] }), isExpanded && renderTree(data[key], fullKey), editingKey === fullKey && editingField && ((0, jsx_runtime_1.jsxs)("div", { style: { paddingLeft: "2rem", marginTop: "4px" }, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Key", value: newKey, onChange: function (e) { return setNewKey(e.target.value); }, style: {
                                            border: "none",
                                            outline: "none",
                                            padding: "4px",
                                            borderRadius: "4px",
                                            marginRight: "8px",
                                            backgroundColor: "transparent",
                                        } }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Value", value: newValue, style: {
                                            border: "none",
                                            outline: "none",
                                            padding: "4px",
                                            borderRadius: "4px",
                                            marginRight: "8px",
                                            backgroundColor: "transparent",
                                        }, onChange: function (e) { return setNewValue(e.target.value); }, onKeyDown: function (e) {
                                            if (e.key == "Enter")
                                                handleAddNewField(fullKey);
                                        } })] }))] })) : ((0, jsx_runtime_1.jsxs)("div", { style: {
                            display: "flex",
                            paddingLeft: "1.25rem",
                            marginTop: "4px",
                        }, onClick: function () { return handleEdit(fullKey, String(data[key])); }, children: [(0, jsx_runtime_1.jsxs)("span", { style: { color: appliedKeyTextColor }, children: [key, ": "] }), editingKey === fullKey ? ((0, jsx_runtime_1.jsx)("input", { type: "text", value: editingValue, onChange: handleChange, className: "".concat(fontStyle || "fira-code"), style: {
                                    border: "none",
                                    outline: "none",
                                    overflow: "scroll",
                                    color: appliedValueTextColor,
                                    backgroundColor: "transparent",
                                }, onBlur: function () { return handleBlur(fullKey); }, autoFocus: true })) : ((0, jsx_runtime_1.jsx)("span", { style: {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color: appliedValueTextColor,
                                }, children: JSON.stringify(data[key]) }))] })) }) }, fullKey));
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "".concat(fontStyle || "fira-code"), style: {
            padding: "1rem",
            backgroundColor: appliedBackgroundColor,
            width: width || "100%",
            margin: "5px",
            borderRadius: "16px",
            border: "1px solid #A6AEBF",
            boxShadow: "#454545",
            maxWidth: "25rem",
            minWidth: "15rem",
            maxHeight: "20rem",
            overflow: "auto",
        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "4px",
                }, children: (0, jsx_runtime_1.jsxs)("div", { onMouseEnter: function () { return setIsTooltipVisible(true); }, onMouseLeave: function () { return setIsTooltipVisible(false); }, style: { position: "relative", cursor: "pointer" }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { color: "".concat(theme == "dark" ? "#fff" : "#000"), size: 20, onClick: copyToClipboard }), isTooltipVisible && ((0, jsx_runtime_1.jsx)("span", { style: {
                                position: "absolute",
                                top: "18px",
                                left: "-12px",
                                backgroundColor: "transparent",
                                color: "".concat(theme == "dark" ? "#fff" : "#000"),
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                                zIndex: 1,
                            }, children: "Copy" }))] }) }), renderTree(jsonData)] }));
};
exports.JsonTree = JsonTree;
