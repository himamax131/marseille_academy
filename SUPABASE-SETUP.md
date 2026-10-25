# ربط الموقع بـ Supabase (مجاني)

## الخطوات بالترتيب

### 1. إنشاء مشروع
1. ادخل على https://supabase.com
2. اضغط **Start your project** وسجّل بحساب Google أو GitHub
3. اضغط **New project**
4. اختار اسم (مثلاً marseille-academy)
5. اختار باسورد قوي للداتا بيز (احفظه)
6. اختار أقرب منطقة واضغط **Create project**
7. استنى دقيقة لحد ما المشروع يتجهز

### 2. إنشاء الجداول
1. من القائمة الجانبية اختار **SQL Editor**
2. اضغط **New query**
3. انسخ كل محتوى ملف `supabase-setup.sql` والصقه
4. اضغط **Run** (أو Ctrl+Enter)
5. لازم يظهر Success

### 3. نسخ مفاتيح الـ API
1. من القائمة: **Settings** → **API**
2. انسخ:
   - **Project URL**
   - **anon public** key

### 4. وضع المفاتيح في الموقع
افتح ملف:
```
js/supabase-config.js
```

وغيّر:
```js
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // حط الـ URL هنا
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';         // حط الـ key هنا
const USE_SUPABASE = true;                         // غيّرها لـ true
```

### 5. ارفع الموقع
ارفع كل الملفات على GitHub Pages أو أي استضافة.

---

## ملاحظات
- الخطة المجانية كافية جداً لموقع أكاديمية
- البيانات هتتسجل في Supabase + نسخة احتياطية في المتصفح
- لو عطّلت Supabase الموقع هيرجع يشتغل بـ localStorage عادي
