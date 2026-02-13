# نشر المشروع على Netlify مع Firebase

حتى يعمل ربط Firebase بعد النشر على Netlify، يجب إضافة **متغيرات البيئة** في لوحة Netlify لأن الـ build يتم على سيرفراتهم وملف `.env` غير موجود هناك.

## الخطوات

### 1. الدخول إلى إعدادات الموقع في Netlify

1. ادخل إلى [Netlify](https://app.netlify.com) وافتح موقعك (Expenses Tracker).
2. من القائمة: **Site configuration** (أو **Site settings**) → **Environment variables**.

### 2. إضافة المتغيرات

اضغط **Add a variable** أو **Add environment variables** ثم أضف المتغيرات التالية **واحدة واحدة** (الاسم والقيمة كما هو، بدون مسافات زائدة):

| الاسم (Key) | القيمة (Value) – من ملف .env عندك |
|-------------|-----------------------------------|
| `VITE_FIREBASE_API_KEY` | قيمة الـ API Key من Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | قيمة Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | قيمة Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | قيمة Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | قيمة Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | قيمة App ID |

يمكنك نسخ القيم من ملف `.env` الموجود على جهازك في مجلد المشروع.

### 3. إعادة النشر (Redeploy)

بعد حفظ المتغيرات:

1. اذهب إلى **Deploys**.
2. اضغط **Trigger deploy** → **Deploy site** (أو **Clear cache and deploy site**).

انتظر حتى ينتهي الـ build، ثم جرّب الموقع من جديد. يجب أن يعمل تسجيل الدخول ونسيت كلمة المرور وربط Firebase بشكل طبيعي.

---

**ملاحظة:** في Vite تُقرأ متغيرات `VITE_*` عند **وقت البناء** فقط، لذلك أي تعديل على Environment variables في Netlify يحتاج إلى **إعادة نشر** (Redeploy) ليطبَّق.
