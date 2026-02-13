# تفعيل قواعد Firestore (حل خطأ Missing or insufficient permissions)

## الخطوات من Firebase Console

1. افتح [Firebase Console](https://console.firebase.google.com) واختر مشروعك **expenses-tracker-e2970**.

2. من القائمة اليسرى: **Firestore Database** (قاعدة البيانات).

3. افتح تبويب **Rules** (القواعد).

4. **احذف** القواعد الحالية واستبدلها بالنص التالي بالكامل:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /expenses/{expenseId} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    match /budgets/{budgetId} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

5. اضغط **Publish** (نشر).

6. ارجع للتطبيق وجرّب إضافة مصروف مرة أخرى.

---

نفس القواعد موجودة في ملف `firestore.rules` في المشروع.
