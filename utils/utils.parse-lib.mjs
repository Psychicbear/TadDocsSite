// lib/parse-members.mjs
import fs from 'fs/promises';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = typeof traverseModule === 'function' ? traverseModule : traverseModule.default;


// (copy the AST walk logic you already have into a function)
export function parseCode(code, { plugins } = {}) {
    const ast = parse(code, { sourceType: 'module', plugins: plugins || [
        'classProperties','classPrivateProperties','classPrivateMethods','privateIn',
        'dynamicImport','optionalChaining','nullishCoalescingOperator'
    ]});
    const methods = new Set();
    const props = new Set();

    function addMethod(name) {
        if (!name) return;
        methods.add(name);
    }

    function addProp(name) {
        if (!name) return;
        props.add(name);
    }

    function getKeyName(node) {
        if (!node) return null;
            switch (node.type) {
                case 'Identifier':
                return node.name.replace(/^#/, '');
                case 'PrivateName':
                return node.id && node.id.name ? node.id.name : null;
                case 'StringLiteral':
                case 'NumericLiteral':
                return String(node.value);
                default:
                return null; // computed or complex, ignore
        }
    }

    traverse(ast, {
        ClassBody(path) {
            for (const el of path.node.body) {
            // ClassMethod covers methods including getters/setters in older AST shapes
            if (el.type === 'ClassMethod') {
                const name = getKeyName(el.key);
                if (!name) continue;
                
                // getters/setters are considered properties
                if (el.kind === 'get' || el.kind === 'set') {
                addProp(name);
                } else if (el.kind === 'constructor') {
                // skip constructor
                } else {
                addMethod(name);
                }
            } else if (el.type === 'ClassProperty') {
                const name = getKeyName(el.key || el);
                if (!name) continue;
                addProp(name);
            }
            }
        },

        // Object literal properties
        ObjectProperty(path) {
            const key = path.node.key;
            const name = getKeyName(key);
            if (!name) return;
            const val = path.node.value;
            if (val && (val.type === 'FunctionExpression' || val.type === 'ArrowFunctionExpression')) {
            addMethod(name);
            } else {
            addProp(name);
            }
        },

        // Handle assignments like SomeClass.prototype.foo = function() {}
        AssignmentExpression(path) {
            const left = path.node.left;
            const right = path.node.right;
            if (left && left.type === 'MemberExpression') {
            // Check pattern: <Identifier>.prototype.<prop>
            const obj = left.object;
            const prop = left.property;
            if (obj && obj.type === 'MemberExpression' && obj.property && obj.property.type === 'Identifier' && obj.property.name === 'prototype') {
                const name = getKeyName(prop);
                if (!name) return;
                if (right && (right.type === 'FunctionExpression' || right.type === 'ArrowFunctionExpression')) {
                addMethod(name);
                } else {
                addProp(name);
                }
            }
            }
        }
    });

// Build JSON array: properties first (type: 'property'), then methods (type: 'method')
const out = [];
for (const p of Array.from(props).sort()) {
  out.push({ type: 'property', name: p });
}
for (const m of Array.from(methods).sort()) {
  out.push({ type: 'method', name: m });
}

  return out; // synchronous array
}

export async function parseFile(filePath, opts) {
  const code = await fs.readFile(filePath, 'utf8');
  return parseCode(code, opts);
}