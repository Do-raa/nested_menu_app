import React, { useState, useEffect, useRef } from 'react';
import './NestedList.css';
import CustomInput from './components/Input';

/**
 * NestedList component to display and manage a hierarchical list with nested items.
 */
const NestedList = () => {
    // State variables to manage items, input values, and various UI states
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [addingChild, setAddingChild] = useState(null);
    const [childValue, setChildValue] = useState('');
    const [hover, setHover] = useState(false);
    const childInputRef = useRef(null); 
  
    /**
     * Handle input value change and capitalize the first letter.
     * @param {object} e - The event object from the input change event.
     */
    const handleInputChange = (e) => {
        setInputValue(capitalizeFirstLetter(e.target.value));
    };

    /**
     * Handle adding a new item to the list.
     */
    const handleAddItem = () => {
        if (inputValue.trim()) {
            setItems([{ name: capitalizeFirstLetter(inputValue.trim()), children: [] }, ...items]);
            setInputValue('');
        }
    };

    /**
     * Handle key press event for the input, adding item on Enter key press.
     * @param {object} e - The event object from the key press event.
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddItem();
        }
    };

    /**
     * Handle initiating the edit process for an item.
     * @param {number} index - The index of the item to edit.
     * @param {Array} path - The path to the item in the nested structure.
     */
    const handleEditItem = (index, path) => {
        const item = getItemByPath(items, path.concat(index));
        setEditing({ index, path });
        setEditValue(item.name); 
    };

    /**
     * Retrieve an item by following the path through the nested structure.
     * @param {Array} items - The list of items.
     * @param {Array} path - The path to the desired item.
     * @returns {object} - The item found at the specified path.
     */
    const getItemByPath = (items, path) => {
        return path.reduce((acc, curr) => acc.children[curr], { children: items });
    };

    /**
     * Handle initiating the add child process for an item.
     * @param {number} index - The index of the parent item.
     * @param {Array} path - The path to the parent item in the nested structure.
     */
    const handleAddChild = (index, path) => {
        setAddingChild({ index, path });
        setChildValue('');
    };

    /**
     * Handle click outside the input field to cancel adding a child if the input is empty.
     * @param {object} event - The event object from the click event.
     */
    const handleClickOutside = (event) => {
        if (childInputRef.current && !childInputRef.current.contains(event.target)) {
            if (!childValue.trim()) {
                setAddingChild(null);
            }
        }
    };

    // Add and remove event listener for click outside the input field
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [childValue]);

    /**
     * Save the edited item name.
     */
    const saveEdit = () => {
        const newItems = [...items];
        let item = newItems;
        for (let idx of editing.path) {
            item = item[idx].children;
        }
        item[editing.index].name = capitalizeFirstLetter(editValue);

        setItems(newItems);
        setEditing(null);
        setEditValue('');
    };

    /**
     * Save a new child item to the nested list.
     * @param {number} index - The index of the parent item.
     * @param {Array} path - The path to the parent item in the nested structure.
     */
    const saveChild = (index, path) => {
        if (childValue.trim()) {
            const newItems = [...items];
            let parent = newItems;

            // Traverse to the correct parent
            for (let i = 0; i < path.length; i++) {
                parent = parent[path[i]].children;
            }

            const newChild = {
                name: capitalizeFirstLetter(childValue.trim()),
                children: []
            };

            parent[index].children.push(newChild);

            setItems(newItems);
            setAddingChild(null);
            setChildValue('');
        }
    };

    /**
     * Capitalize the first letter of a string.
     * @param {string} string - The string to capitalize.
     * @returns {string} - The capitalized string.
     */
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    /**
     * Render the nested list items recursively.
     * @param {Array} items - The list of items to render.
     * @param {Array} path - The path to the current level in the nested structure.
     * @returns {JSX.Element} - The rendered list items.
     */
    const renderItems = (items, path = []) => {
        return items?.map((item, index) => {
            const currentPath = path.concat(index);
            const isMaxLevel = currentPath.length >= 3;
            return (
                <li key={index} className="item" style={{listStyleType: "square"}}>
                    {editing && editing.index === index && JSON.stringify(editing.path) === JSON.stringify(path) ? (
                        <CustomInput
                            value={editValue}
                            onChange={(e) => setEditValue(capitalizeFirstLetter(e.target.value))}
                            onBlur={saveEdit}
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        />
                    ) : (
                        <span onClick={() => handleEditItem(index, path)}>{item.name}</span>
                    )}
                    {!isMaxLevel && (
                        <>
                            <div className="tooltip">
                                <button onClick={() => handleAddChild(index, path)}>+</button>
                                <span className="tooltiptext">Add Child</span>
                            </div>
                            {addingChild && addingChild.index === index && JSON.stringify(addingChild.path) === JSON.stringify(path) && (
                                <div className="child-input-container" ref={childInputRef}>
                                    <CustomInput
                                        value={childValue}
                                        onChange={(e) => setChildValue(capitalizeFirstLetter(e.target.value))}
                                        onBlur={() => saveChild(index, path)}
                                        onKeyPress={(e) => e.key === 'Enter' && saveChild(index, path)}
                                        placeholder="Enter child item"
                                    />
                                </div>
                            )}
                        </>
                    )}
                    <div className="children">{renderItems(item?.children, currentPath)}</div>
                </li>
            );
        });
    };

    return (
        <div className="add-to-list">
            <div className="input-container">
                <CustomInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter item"
                />
                <button
                    style={{ height: '35px', width: '50px', padding: '5px', margin: '3px', borderRadius: '3px', backgroundColor: hover ? '#f293fb' : '#E15FED', fontWeight: 'bold' }}
                    onClick={handleAddItem}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    Add
                </button>
            </div>
            <div className="list-container">
                {renderItems(items)}
            </div>
        </div>
    );
};

export default NestedList;
