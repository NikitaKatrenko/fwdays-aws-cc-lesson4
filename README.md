# 📝 Serverless Notes App (AWS Lambda + API Gateway + DynamoDB + React)



Демонстраційний full-stack застосунок з AWS Serverless.
Фронтенд - **React**, бекенд serverless: **API Gateway → Lambda → DynamoDB**.


## ⚡ Архітектура

```
React (S3 + CloudFront)
        ⇅  HTTP
API Gateway (REST API)
        ⇅  invoke
Lambda (NodeJS/TypeScript)
        ⇅
DynamoDB (таблиця Notes)
```

Фронтенд робить HTTP-запити до API Gateway, який викликає Lambda-функції.
Lambda читає та записує дані у DynamoDB.

---

## 📁 Структура проєкту

```
backend/
  cdk/
    bin/app.ts                 # Точка входу CDK — створення стеків
    lib/
      dynamodb-stack.ts        # Створення DynamoDB таблиці
      lambda-stack.ts          # Lambda-функції + права доступу
      api-stack.ts             # API Gateway та інтеграція з Lambda
  lambda/
    getNotes.ts                # Lambda для читання нотаток
    createNote.ts              # Lambda для створення нотаток

frontend/
  ... ваш React застосунок ...
```

---

## 🧩 Основні компоненти

### **DynamoDB**

* Таблиця `Notes`
* `id` — partition key
* `createdAt` — sort key
* PAY_PER_REQUEST — автоматичне масштабування без налаштувань

### **Lambda**

* `getNotes.ts` — повертає всі нотатки
* `createNote.ts` — створює нову нотатку
* Оточення містить `NOTES_TABLE`

### **API Gateway (REST)**

* `GET /notes` → `getNotesFn`
* `POST /notes` → `createNoteFn`
* Увімкнений CORS для фронтенда

### **React фронтенд**

* Викликає API
* Показує список нотаток
* Додає нову нотатку

---

## 🚀 Деплой

У каталозі `backend/cdk`:

```bash
npm install
cdk bootstrap     # один раз на акаунт/регіон
cdk deploy        # створює всі ресурси
```

Після деплою CDK виведе:

* URL API Gateway
* Імʼя таблиці DynamoDB
* Lambda ARNs

---

## 🧪 Тестування API

**GET:**

```bash
curl https://xxx.execute-api.eu-central-1.amazonaws.com/prod/notes
```

**POST:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "content": "Hello AWS!"}' \
  https://xxx.execute-api.eu-central-1.amazonaws.com/prod/notes
```

---

## 🌐 Хостинг фронтенда

Збірка:

```bash
npm run build
```

Деплой у S3:

```bash
aws s3 sync dist/ s3://your-bucket-name
```

---

## 📌 Вимоги

* AWS CLI + налаштований профіль
* Node.js 18+
* AWS CDK v2

---
