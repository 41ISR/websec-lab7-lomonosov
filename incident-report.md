# Security Report

## Найденные уязвимости и исправления

### 1. SQL Injection в `index.js`
**Ошибка:**
```
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
```

**Исправление:**
```js
const query = `SELECT * FROM users WHERE username = ? AND password = ?`
db.get(query, [username, password], (err, user) => { ... })
```

---

### 2. SQL Injection в `index.js`
**Ошибка:**
```js
const query = `SELECT * FROM users WHERE username LIKE '%${search}%'`
```

**Исправление:**
```js
const query = `SELECT * FROM users WHERE username LIKE ?`
db.all(query, [`%${search}%`], (err, users) => { ... })
```

---

### 3. SQL Injection в `index.js`
**Ошибка:**
```js
const query = `UPDATE users SET username = '${username}' WHERE id = ${id}`
```

**Исправление:**
```js
const query = `UPDATE users SET username = ? WHERE id = ?`
db.run(query, [username, id], function (err) { ... })
```

---

### 4. SQL Injection в `index.js`
**Ошибка:**
```js
db.run(
    `INSERT INTO messages (user_id, content) VALUES (${user_id}, '${content}')`,
    function (err) { ... }
)
```

**Исправление:**
```js
db.run(
    `INSERT INTO messages (user_id, content) VALUES (?, ?)`,
    [user_id, content],
    function (err) { ... }
)
```

---

### 5. XSS-уязвимость в `Messages.tsx`
**Ошибка:**
```tsx
<div dangerouslySetInnerHTML={{ __html: msg.content }} />
```

**Исправление:**
```tsx
import DOMPurify from "dompurify"

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }} />
```

---

### 6. Хранение паролей в открытом виде
**Ошибка:**
```js
db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password])
```

**Исправление:**
```js
const bcrypt = require("bcrypt")

app.post("/auth/register", (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        const hashedPassword = bcrypt.hash(password, 10)
        return res
            .status(400)
            .json({ error: "Username and password are required" })
    }

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function (err) {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "User already exists or database error" })
            }
            res.json({ success: true, userId: this.lastID })
        }
    )
})
```
---


### 7. Отсутствие защиты от CSRF
**Ошибка:**
Нет защиты от CSRF.

**Исправление:**
```js
const csurf = require("csurf")
const csrfProtection = csurf({ cookie: true })
app.use(csrfProtection)
```

