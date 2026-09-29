# @je/rules

Owns the safe expression evaluator used for content conditions and effects. Expressions are JSON
trees interpreted by a fixed operator table, with depth and size limits. There is no `eval`,
`Function` or arbitrary property access (ESLint and a test both enforce this).

- `evaluate(expr, scope)`: runs an expression; throws `ExpressionError` with a code and JSON path.
- `validate(expr)`: static check (shape, operators, arity, limits); never throws.
- `collectVars(expr)`: the variable paths an expression reads.

A bare string is a variable path; use `{"lit": "text"}` for a string literal.
