## Funcionalidades

* **[Login de Usuário](#login-de-usuário):** Permite que usuários existentes façam login e recebam um token JWT para acesso às rotas protegidas.
* **User (Protegido por JWT):**
    * **[Registro de Usuário](#registro-de-usuário):** Permite a criação de novos usuários no sistema.
    * **[Buscar Usuário por ID](#buscar-usuário-por-id):** Retorna os dados de um usuário específico com base no seu ID.
    * **[Atualizar Usuário](#atualizar-usuário):** Permite a modificação dos dados de um usuário existente.
    * **[Deletar Usuário](#deletar-usuário):** Permite a remoção de um usuário do sistema.
    * **[Buscar usuários por XP](#buscar-usuários-por-xp):**
    Busca os usuários com mais XP
* **Exam (Protegido por JWT):**
* **Challenge (Protegido por JWT):**
* **Products (Protegido por JWT):**



### **Registro de Usuário**
---
`POST` / `localhost:8080/register`

**Request Header**
|Key|Value|
|---|----|
|Authorization|Bearer <token>|

**Request Body**

|Field|Type|required|Description
|-----|----|:-----------:|---------
|Name |String|✅|Nome do usuário
|Email|String|✅|Email do usuário
|Password|String|✅|Senha do usuário
|Class|String|✅|Classe do usuário

```js
{
    "Name":"Ana Silva",
    "Email":"ana@gmail.com",
    "Password": "ana123",
    "Class":"5ETF"
}
```

**Exemplo de Resposta**

```js
{
    "data": {
        "Name":"Ana Silva",
        "Email":"ana@gmail.com"
    }
    "message":"successfully registered user"
}
```



### **Login de Usuário**
---
`POST` / `localhost:8080/login`

|Field|Type|required|Description
|-----|----|:-----------:|---------
|Email|String|✅|Email do usuário
|Password|String|✅|Senha do usuário

**Request Body**

```js
{
    "email": "email@email.com",
    "password": "Komatsu#2005"
}
```

**Exemplo de Resposta**

```js
{
    "sucess": true,
    "msg": "user autenticathed"
}
```



### **Buscar Usuário por ID**
--- 
`GET` / `localhost:8080/user/{id}`

**Request Header**
|Key|Value|
|---|----|
|Authorization|Bearer <token>|

**Request Param**
|Field|Type|required|Descriptio
|----|------|-------|--------|
|`id`|String|✅| ID by user

**Exemplo de Resposta**

```js
{
    "data": {
        id: 1,
        name: "Ana Silva",
        avatar: "/placeholder.svg?height=80&width=80",
        xp: 3250,
        challengesCompleted: 28,
        position: 1,
        badge: "Hacker Elite",
        class: "6FEG"
        ruby: 233
        diamond: 7
    },
    "msg": "user successfully searched"
}
```

### **Atualizar usuário**
---
`PUT` / `localhost:8080/user`

**Request Header**
|Key|Value|
|---|----|
|Authorization|Bearer <token>|

**Request Body**
|Field|Type|required|Description
|-----|----|:-----------:|---------
|Avatar|string|✅|Avatar do |Email|String|✅|Flag de resposta do usuário


```json
{
    
}
```




### **Buscar usuários por XP**
---
`GET` / `localhost:8080/user/rank`

**Request Header**
|Key|Value|
|---|----|
|Authorization|Bearer <token>|

**Exemplo de Resposta**

```js
{
    [
        {
        id: 1,
        name: "Ana Silva",
        avatar: "/placeholder.svg?height=80&width=80",
        xp: 3250,
        challengesCompleted: 28,
        position: 1,
        badge: "Hacker Elite",
        class: "6FEG"
        },
        {
        id: 2,
        name: "Carlos Santos",
        avatar: "/placeholder.svg?height=80&width=80",
        xp: 2890,
        challengesCompleted: 24,
        position: 2,
        badge: "Cyber Warrior",
        class: "6FEG"
        }
    ]
}
```



### **Resposta de Desafio**
---
`POST` / `localhost:8080/challenge`

**Request Header**
|Key|Value|
|---|----|
|Authorization|Bearer <token>|


|Field|Type|required|Description
|-----|----|:-----------:|---------
|desafio_id|Number|✅|Identificador do desafio
|flag|String|✅|Flag de resposta do usuário

**Request Body**

```json
{
    "desafio_id": 1,
    "flag": "FLAG={<flag>}"
}
```

**Exemplo de Resposta**
- ✅ **200 OK**:
```json
{
    "correct_answer": true,
    "xp": 999,
    "ruby": 999,
    "diamond": 999
}
```
- ❌ **400 Bad Request**:
```json
{
    "correct_answer": false,
}
```



### **Resposta de Prova**
---
`POST` / `localhost:8080/test`

**Request Header**
|Key|Value|
|---|----|
|Authorization|Bearer <token>|


|Field|Type|required|Description
|-----|----|:-----------:|---------
|test_id|Number|✅|Identificador da prova
|questions|List|✅|Lista resposta de questões

**Request Body**

```json
{
    "test_id": 1,
    "questions": {
        "ex_1": "<answer>",
        "ex_2": "<answer>",
        "ex_3": "<answer>"
    }
}
```

**Exemplo de Resposta**
- ✅ **200 OK**:
```json
{
    "xp": 999,
    "ruby": 999,
    "diamond": 999
}
```
- ❌ **400 Bad Request**:
```json
{
    "err": false,
}
```

