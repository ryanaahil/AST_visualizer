"""
AST Parser Module - Converts Python code into a JSON-serializable tree structure.
Supports parsing Python code and converting the AST to a format suitable for visualization.
"""

import ast
import json
from typing import Any, Dict, List, Optional


class ASTConverter:
    """Convert Python AST nodes to JSON-serializable dictionaries."""

    def __init__(self):
        self.node_id_counter = 0

    def _get_node_id(self) -> int:
        """Generate unique node IDs."""
        node_id = self.node_id_counter
        self.node_id_counter += 1
        return node_id

    def _get_node_attributes(self, node: ast.AST) -> Dict[str, Any]:
        """Extract meaningful attributes from an AST node."""
        attrs = {}
        for field, value in ast.iter_fields(node):
            if isinstance(value, (str, int, float, bool, type(None))):
                attrs[field] = value
            elif isinstance(value, list):
                # Skip list fields as they're handled as children
                pass
        return attrs

    def convert_node(self, node: Optional[ast.AST]) -> Optional[Dict[str, Any]]:
        """
        Convert an AST node to a JSON-serializable dictionary.
        
        Args:
            node: An AST node or None
            
        Returns:
            A dictionary representation of the node with id, name, attributes, and children
        """
        if node is None:
            return None

        if not isinstance(node, ast.AST):
            # For non-AST values, return as-is if primitive
            if isinstance(node, (str, int, float, bool)):
                return {"type": "value", "value": node}
            return None

        node_dict = {
            "id": self._get_node_id(),
            "name": node.__class__.__name__,
            "attributes": self._get_node_attributes(node),
            "children": [],
        }

        # Process all child nodes
        for field, value in ast.iter_fields(node):
            if isinstance(value, list):
                for item in value:
                    if isinstance(item, ast.AST):
                        child = self.convert_node(item)
                        if child:
                            node_dict["children"].append(
                                {
                                    "field": field,
                                    "node": child,
                                }
                            )
            elif isinstance(value, ast.AST):
                child = self.convert_node(value)
                if child:
                    node_dict["children"].append(
                        {
                            "field": field,
                            "node": child,
                        }
                    )

        return node_dict

    def parse_and_convert(self, code: str) -> Dict[str, Any]:
        """
        Parse Python code and convert the AST to a JSON-serializable structure.
        
        Args:
            code: Python code to parse
            
        Returns:
            Dictionary with tree data and metadata
        """
        self.node_id_counter = 0
        
        try:
            tree = ast.parse(code)
            root = self.convert_node(tree)
            
            return {
                "success": True,
                "tree": root,
                "error": None,
                "lines": len(code.split("\n")),
            }
        except SyntaxError as e:
            return {
                "success": False,
                "tree": None,
                "error": f"Syntax Error at line {e.lineno}: {e.msg}",
                "lines": len(code.split("\n")),
            }
        except Exception as e:
            return {
                "success": False,
                "tree": None,
                "error": f"Parse Error: {str(e)}",
                "lines": len(code.split("\n")),
            }


class TreeFlattener:
    """Convert tree structure to a flattened format for D3 visualization."""

    @staticmethod
    def flatten_tree(tree_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert nested tree structure to a flattened hierarchy format.
        
        Args:
            tree_dict: The tree dictionary from ASTConverter
            
        Returns:
            A flattened structure optimized for D3
        """
        if not tree_dict:
            return {}

        nodes = []
        links = []
        node_queue = [(tree_dict, None)]

        while node_queue:
            node, parent_id = node_queue.pop(0)

            if not isinstance(node, dict) or "id" not in node:
                continue

            node_id = node["id"]
            nodes.append({
                "id": node_id,
                "name": node.get("name", "Unknown"),
                "attributes": node.get("attributes", {}),
                "type": "node",
            })

            if parent_id is not None:
                links.append({
                    "source": parent_id,
                    "target": node_id,
                    "field": node.get("field", ""),
                })

            for child in node.get("children", []):
                if isinstance(child, dict) and "node" in child:
                    node_queue.append((child["node"], node_id))

        # Build a hierarchical (nested) structure suitable for d3.hierarchy / d3.tree
        def build_hierarchy(node: Dict[str, Any]) -> Dict[str, Any]:
            h = {
                "id": node.get("id"),
                "name": node.get("name"),
                "attributes": node.get("attributes", {}),
                "children": [],
            }
            for child in node.get("children", []):
                if isinstance(child, dict) and "node" in child:
                    child_node = build_hierarchy(child["node"]).copy()
                    # preserve the field name that connects child to parent
                    child_node["field"] = child.get("field", "")
                    h["children"].append(child_node)
            if not h["children"]:
                h.pop("children")
            return h

        hierarchy = build_hierarchy(tree_dict) if tree_dict else None

        return {
            "nodes": nodes,
            "links": links,
            "hierarchy": hierarchy,
        }


def parse_code(code: str) -> Dict[str, Any]:
    """
    Main entry point: parse code and return both nested and flattened formats.
    
    Args:
        code: Code to parse
        
    Returns:
        Dictionary with parse results
    """
    converter = ASTConverter()
    result = converter.parse_and_convert(code)
    
    if result["success"] and result["tree"]:
        flattened = TreeFlattener.flatten_tree(result["tree"])
        result["flattened"] = flattened
    else:
        result["flattened"] = None
    
    return result
