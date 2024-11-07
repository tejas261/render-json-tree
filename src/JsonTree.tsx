import React, { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Plus } from "lucide-react";
import { colorSchemes } from "./colorPalette";
import { JsonData, EditableJsonTreeProps } from "./types";

export const JsonTree: React.FC<EditableJsonTreeProps> = ({
  data,
  width,
  theme = "light",
  backgroundColor,
  keyTextColor,
  valueTextColor,
  fontSize,
  fontStyle,
}) => {
  // Apply color scheme based on theme, falling back to specific props if provided
  const selectedColors = colorSchemes[theme];
  const appliedBackgroundColor =
    backgroundColor || selectedColors.backgroundColor;
  const appliedKeyTextColor = keyTextColor || selectedColors.keyTextColor;
  const appliedValueTextColor = valueTextColor || selectedColors.valueTextColor;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [jsonData, setJsonData] = useState<JsonData>(data);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [editingField, setEditingField] = useState<boolean>(false);

  const handleEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditingValue(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
  };

  const handleBlur = (key: string) => {
    const keys = key.split(".");
    let current = jsonData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as JsonData;
    }

    // Get the original value type for the current key
    const originalValue = current[keys[keys.length - 1]];
    let newValue: string | number | boolean;

    // Determine the type and parse accordingly
    if (typeof originalValue === "number") {
      newValue = Number(editingValue); // Convert to number
    } else if (typeof originalValue === "boolean") {
      newValue = editingValue.toLowerCase() === "true"; // Convert to boolean
    } else {
      newValue = editingValue; // Keep as string
    }

    current[keys[keys.length - 1]] = newValue;

    setJsonData({ ...jsonData });
    setEditingKey(null);
    setEditingValue("");
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const copyToClipboard = () => {
    const contentToCopy = JSON.stringify(jsonData, null, 2);
    navigator.clipboard
      .writeText(contentToCopy)
      .then(() => console.log("Content copied to clipboard"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleAddNewField = (parentKey: string) => {
    const keys = parentKey.split(".");
    let current = jsonData;
    for (const key of keys) {
      current = current[key] as JsonData;
    }

    if (Array.isArray(current)) {
      current.push({ key: newKey, value: newValue });
    } else {
      (current as JsonData)[newKey] = newValue;
    }

    setJsonData({ ...jsonData });
    setNewKey("");
    setNewValue("");
    setHoveredKey(null);
    setEditingField(false);
  };

  const renderTree = (data: JsonData, parentKey = "") => {
    return Object.keys(data)
      .filter((key) => key !== "position")
      .map((key, keyIndex) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const isExpanded = expandedKeys[fullKey];
        const isObject = typeof data[key] === "object" && data[key] !== null;

        return (
          <div
            key={fullKey}
            style={{
              marginLeft: "14px",
              marginBottom: "5px",
              backgroundColor: appliedBackgroundColor,
            }}
            onMouseEnter={() => setHoveredKey(fullKey)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div>
              {isObject ? (
                <>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => toggleExpand(fullKey)}
                  >
                    {isExpanded ? (
                      <ChevronDown color="#B8B8B8" size={16} />
                    ) : (
                      <ChevronRight color="#B8B8B8" size={16} />
                    )}
                    <h1
                      style={{
                        fontSize: fontSize || "1rem",
                        lineHeight: "1.25rem",
                        fontWeight: 700,
                        paddingLeft: "0.5rem",
                        color: appliedKeyTextColor,
                      }}
                    >
                      {key}
                    </h1>
                    {hoveredKey === fullKey && (
                      <Plus
                        style={{
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        color={`${theme == "dark" ? "#fff" : "#000"}`}
                        size={16}
                        onClick={() => {
                          setEditingField(true);
                          setEditingKey(fullKey);
                        }}
                      />
                    )}
                  </div>
                  {isExpanded && renderTree(data[key] as JsonData, fullKey)}
                  {editingKey === fullKey && editingField && (
                    <div style={{ paddingLeft: "2rem", marginTop: "4px" }}>
                      <input
                        type="text"
                        placeholder="Key"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        style={{
                          border: "none",
                          outline: "none",
                          padding: "4px",
                          borderRadius: "4px",
                          marginRight: "8px",
                          backgroundColor: "transparent",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={newValue}
                        style={{
                          border: "none",
                          outline: "none",
                          padding: "4px",
                          borderRadius: "4px",
                          marginRight: "8px",
                          backgroundColor: "transparent",
                        }}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key == "Enter") handleAddNewField(fullKey);
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    paddingLeft: "1.25rem",
                    marginTop: "4px",
                  }}
                  onClick={() => handleEdit(fullKey, String(data[key]))}
                >
                  <span style={{ color: appliedKeyTextColor }}>{key}: </span>
                  {editingKey === fullKey ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={handleChange}
                      className={`${fontStyle || "fira-code"}`}
                      style={{
                        border: "none",
                        outline: "none",
                        overflow: "scroll",
                        color: appliedValueTextColor,
                        backgroundColor: "transparent",
                      }}
                      onBlur={() => handleBlur(fullKey)}
                      autoFocus
                    />
                  ) : (
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: appliedValueTextColor,
                      }}
                    >
                      {JSON.stringify(data[key])}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      });
  };

  return (
    <div
      className={`${fontStyle || "fira-code"}`}
      style={{
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
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "4px",
        }}
      >
        <div
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <Copy
            color={`${theme == "dark" ? "#fff" : "#000"}`}
            size={20}
            onClick={copyToClipboard}
          />
          {isTooltipVisible && (
            <span
              style={{
                position: "absolute",
                top: "18px",
                left: "-12px",
                backgroundColor: "transparent",
                color: `${theme == "dark" ? "#fff" : "#000"}`,
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                zIndex: 1,
              }}
            >
              Copy
            </span>
          )}
        </div>
      </div>
      {renderTree(jsonData)}
    </div>
  );
};
