import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Copy, Plus } from "lucide-react";

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
  index: number;
}

export const JsonTree: React.FC<EditableJsonTreeProps> = ({ data, index }) => {
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

  const updateSessionStorage = (updatedData: JsonData) => {
    const integrationFlow = JSON.parse(
      sessionStorage.getItem("integrationFlow") || "{}"
    );

    if (integrationFlow?.apis) {
      integrationFlow.apis[index] = { ...updatedData };
      sessionStorage.setItem(
        "integrationFlow",
        JSON.stringify(integrationFlow)
      );
      console.log("Flow changes", integrationFlow);
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const copyToClipboard = (data: any) => {
    const contentToCopy = JSON.stringify(data, null, 2);
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
      // If the target is an array, push a new object into the array
      current.push({ key: newKey, value: newValue });
    } else {
      // If the target is an object, add a new key-value pair
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
            style={{ marginLeft: "14px", marginBottom: "5px" }}
            onMouseEnter={() => setHoveredKey(fullKey)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div>
              {keyIndex === 0 && (
                <Copy
                  size={28}
                  className="absolute right-6 border p-1 rounded-sm cursor-pointer top-[4rem]"
                  onClick={() => copyToClipboard(data)}
                />
              )}
              {isObject ? (
                <>
                  <div
                    onClick={() => toggleExpand(fullKey)}
                    className="cursor-pointer mt-4 flex items-center"
                  >
                    {isExpanded ? (
                      <ChevronDown color="#B8B8B8" size={16} />
                    ) : (
                      <ChevronRight color="#B8B8B8" size={16} />
                    )}
                    <h1 className="text-sm font-medium mx-2">{key}</h1>
                    {hoveredKey === fullKey && (
                      <Plus
                        size={16}
                        className="cursor-pointer ml-2"
                        onClick={() => {
                          setEditingField(true);
                          setEditingKey(fullKey);
                        }}
                      />
                    )}
                  </div>
                  {isExpanded && renderTree(data[key] as JsonData, fullKey)}
                  {editingKey === fullKey && editingField && (
                    <div className={`ml-8 mt-1`}>
                      <input
                        type="text"
                        placeholder="Key"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="border-none outline-none p-1 rounded mr-2"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="border p-1 rounded"
                        onKeyDown={(e) => {
                          if (e.key == "Enter") handleAddNewField(fullKey);
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="flex ml-5 mt-1"
                  onClick={() => handleEdit(fullKey, String(data[key]))}
                >
                  <span className="text-toast-info">{key}: </span>
                  {editingKey === fullKey ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={handleChange}
                      className="w-[80%] border-none  outline-none text-success-500 overflow-scroll"
                      onBlur={() => handleBlur(fullKey)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-success-500 w-[83%] truncate">
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

  return <div>{renderTree(jsonData)}</div>;
};
