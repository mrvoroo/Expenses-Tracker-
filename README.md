# تتبع المصاريف | Expenses Tracker

تطبيق ويب لتتبع المصروفات الشخصية والعائلية مع تحليل الإنفاق وتنبيهات الميزانية.

## التقنيات

- **واجهة أمامية:** React 19 + TypeScript + Vite
- **قاعدة البيانات:** Firebase Firestore
- **المصادقة:** Firebase Authentication
- **التصميم:** Tailwind CSS v4
- **الرسوم البيانية:** Recharts
- **النماذج:** React Hook Form
- **التواريخ:** date-fns

## التشغيل المحلي

### 1. تثبيت الحزم

```bash
npm install
```

### 2. إعداد Firebase

1. أنشئ مشروعاً في [Firebase Console](https://console.firebase.google.com).
2. فعّل **Authentication** (Email/Password).
3. أنشئ قاعدة بيانات **Firestore**.
4. انسخ `.env.example` إلى `.env` واملأ قيم مشروعك:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. تشغيل المشروع

```bash
npm run dev
```

افتح المتصفح على الرابط المعروض (عادة `http://localhost:5173`).

## البناء للنشر

```bash
npm run build
```

الملفات الناتجة في `dist/`. يمكن رفعها على Firebase Hosting أو أي استضافة ثابتة.

## هيكل المشروع

```
src/
├── components/     # مكونات الواجهة
│   ├── dashboard/ # لوحة التحكم والرسوم
│   ├── expenses/   # نموذج وقائمة المصاريف
│   ├── layout/     # الهيدر والسايدبار
│   └── shared/     # أزرار، مودال، loader
├── hooks/          # useAuth, useExpenses
├── pages/          # الصفحات
├── services/       # Firebase وخدمات المصاريف
├── types/          # TypeScript
└── utils/          # تنسيق، ثوابت، تحقق
```

## PWA

المشروع يدعم PWA: يوجد `public/manifest.json`. لإكمال الدعم يمكن إضافة Service Worker (مثلاً عبر `vite-plugin-pwa`).

## الترخيص

MIT
