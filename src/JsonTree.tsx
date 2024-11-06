import React, { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Plus } from "lucide-react";
import { colorSchemes } from "./colorPalette";

type JsonData = {
  [key: string]:
    | string
    | number
    | boolean
    | JsonData
    | (string | number)[]
    | JsonData[];
};

interface EditableJsonTreeProps {
  data: JsonData;
  width: string;
  viewStyle?: "dark" | "light";
  backgroundColor?: string;
  keyTextColor?: string;
  valueTextColor?: string;
  fontSize?: string;
  fontStyle?: string;
}

export const JsonTree: React.FC<EditableJsonTreeProps> = ({
  data,
  width,
  viewStyle = "light",
  backgroundColor,
  keyTextColor,
  valueTextColor,
  fontSize,
  fontStyle,
}) => {
  // Apply color scheme based on viewStyle, falling back to specific props if provided
  const selectedColors = colorSchemes[viewStyle];
  const appliedBackgroundColor =
    backgroundColor || selectedColors.backgroundColor;
  const appliedKeyTextColor = keyTextColor || selectedColors.keyTextColor;
  const appliedValueTextColor = valueTextColor || selectedColors.valueTextColor;

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
    current[keys[keys.length - 1]] = editingValue;

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
                        color={`${viewStyle == "dark" ? "#fff" : "#000"}`}
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
                      style={{
                        border: "none",
                        outline: "none",
                        overflow: "scroll",
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
      className={`${fontStyle || "source-code-pro"}`}
      style={{
        padding: "1rem",
        backgroundColor: appliedBackgroundColor,
        width: width,
        margin: "5px",
        borderRadius: "8px",
        border: "1px solid grey",
      }}
    >
      {/* Copy icon at the top of the JSON tree */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "4px",
        }}
      >
        <Copy
          color={`${viewStyle == "dark" ? "#fff" : "#000"}`}
          size={20}
          style={{
            cursor: "pointer",
            border: "1px",
            borderRadius: "2px",
          }}
          onClick={copyToClipboard}
        />
      </div>
      {renderTree(jsonData)}
    </div>
  );
};
