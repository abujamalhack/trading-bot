# 𝑃𝑟𝑜𝑗𝑒𝑐𝑡 𝐹𝑙𝑎𝑠ℎ 𝐶𝑜𝑙𝑜𝑟 𝑤𝑎𝑠 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦 𝑐𝑦𝑏𝑒𝑟𝑠𝑒𝑐𝑢𝑟𝑖𝑡𝑦 𝑒𝑥𝑝𝑒𝑟𝑡 𝐴𝑏𝑢 𝐽𝑎𝑚𝑎𝑙 𝐴𝑏𝑑𝑢𝑙 𝑁𝑎𝑠𝑠𝑒𝑟 𝑀𝑢𝑟𝑠ℎ𝑖𝑑 𝐴𝑙-𝑆ℎ𝑎𝑤𝑘𝑖
# 🤖 نظام التداول الآلي الاحترافي (Professional Trading Bot)

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue" alt="Version 2.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/TypeScript-5.3%2B-blue" alt="TypeScript 5.3+">
  <img src="https://img.shields.io/badge/EVM-Compatible-important" alt="EVM Compatible">
</p>

<p align="center">
  <b>نظام متكامل للتداول الآلي على شبكات EVM (Base، Arbitrum، Polygon) مع تحليل أمان متقدم، Oracle حي من Chainlink، تنبيهات Telegram، وإدارة مخاطر كاملة.</b>
</p>

---

## 📋 جدول المحتويات
- [المميزات الرئيسية](#-المميزات-الرئيسية)
- [المتطلبات الأساسية](#-المتطلبات-الأساسية)
- [التثبيت والإعداد](#-التثبيت-والإعداد)
- [ملف البيئة (.env)](#-ملف-البيئة-env)
- [أوامر CLI](#-أوامر-cli)
- [استراتيجية التداول](#-استراتيجية-التداول)
- [إدارة المخاطر](#-إدارة-المخاطر)
- [التنبيهات (Telegram)](#-التنبيهات-telegram)
- [وضع Paper Trading](#-وضع-paper-trading)
- [هيكل قاعدة البيانات](#-هيكل-قاعدة-البيانات)
- [نصائح الأمان](#-نصائح-الأمان)
- [استكشاف الأخطاء الشائعة](#-استكشاف-الأخطاء-الشائعة)
- [الدعم والتواصل](#-الدعم-والتواصل)
- [الترخيص](#-الترخيص)

---

## ✨ المميزات الرئيسية

- 🚀 **استماع لحظي لأزواج جديدة** عبر WebSocket (أحداث `PairCreated` من الـ Factory).
- 🔐 **تحليل أمان متقدم** للتوكنات باستخدام [GoPlus API](https://gopluslabs.io/) لكشف Honeypot، الضرائب المرتفعة، وإمكانية Mint.
- 💧 **حساب السيولة بالدولار بدقة** باستخدام سعر ETH/USD الحي من **Chainlink Oracle**.
- 📊 **إدارة مخاطر صارمة**:
  - الحد الأقصى للصفقات المتزامنة.
  - الحد الأقصى للصفقات في الساعة.
  - تتبع الخسائر المتتالية (قابل للتطوير).
  - حد الخسارة اليومي بالنسبة المئوية.
- 💰 **تنفيذ صفقات Buy/Sell** مع انزلاق محدد (Slippage) وغاز متحكم به.
- 🎯 **استراتيجية خروج ذكية**:
  - خروج جزئي عند نسب ربح محددة (مثلاً 25%، 50%).
  - Trailing Stop للحماية من التراجع.
  - Stop Loss ثابت.
- 📈 **إدارة مراكز متعددة** مع تحديثات مستمرة.
- 📱 **تنبيهات فورية عبر Telegram** لكل عملية شراء/بيع، أخطاء، وتحذيرات.
- 🧪 **وضع Paper Trading** للمحاكاة الكاملة بدون أموال حقيقية (مثالي للاختبار).
- 🖥️ **واجهة CLI** للتحكم بالبوت (تشغيل، إيقاف، تغيير الشبكة، تفعيل Paper Trading).
- 💾 **تخزين جميع البيانات في SQLite** (المراكز، الصفقات) لسهولة التحليل والمراجعة.
- 🔄 **إعادة اتصال تلقائي** عند انقطاع WebSocket.

---

## 📦 المتطلبات الأساسية

- **Node.js** الإصدار 18 أو أحدث.
- **VPS** (يوصى بـ 4GB RAM، 2 vCPU) مع قرب جغرافي من مزود RPC.
- **محفظة Ethereum** (مخصصة للبوت) بها رصيد كافٍ من العملة الأصلية (ETH لشبكات Base/Arbitrum، MATIC لشبكة Polygon).
- **مفاتيح API**:
  - [Alchemy](https://www.alchemy.com/) أو [QuickNode](https://www.quicknode.com/) للحصول على رابط WebSocket سريع.
  - (اختياري) [GoPlus API Key](https://docs.gopluslabs.io/) لزيادة حدود الطلبات.
  - [Telegram Bot Token](https://t.me/BotFather) ومعرف الدردشة (Chat ID).
- **معرفة أساسية** بالعمل على سطر الأوامر وملفات البيئة.

---

## 🔧 التثبيت والإعداد

### 1. استنساخ المستودع أو إنشاء المجلد
```bash
git clone https://github.com/your-repo/trading-bot.git
cd trading-bot
```
أو يمكنك إنشاء المجلد يدوياً ونسخ الملفات.

### 2. تثبيت الاعتماديات
```bash
npm install
```

### 3. إعداد ملف البيئة
انسخ نموذج ملف البيئة وعدل المتغيرات الرئيسية:
```bash
cp .env.example .env
nano .env   # أو استخدم أي محرر نصوص
```

### 4. بناء المشروع
```bash
npm run build
```

### 5. تشغيل البوت
- **للاختبار باستخدام Paper Trading** (بدون أموال حقيقية):
  ```bash
  PAPER_TRADING=true npm start
  ```
- **للتشغيل الفعلي** (بعد الاختبار):
  ```bash
  npm start
  ```
- **للاستمرارية على VPS** باستخدام PM2:
  ```bash
  npm install -g pm2
  pm2 start ecosystem.config.js
  ```

---

## ⚙️ ملف البيئة (.env)

يحتوي ملف `.env` على جميع إعدادات البوت. انسخ المثال وعدل القيم حسب شبكتك وتفضيلاتك.

```env
# ===== الشبكة =====
NETWORK=base
WNATIVE_ADDRESS=0x4200000000000000000000000000000000000006
FACTORY_ADDRESS=0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6
ROUTER_ADDRESS=0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24
RPC_WS_URL=wss://base-mainnet.g.alchemy.com/v2/your-api-key
RPC_HTTP_URL=https://base-mainnet.g.alchemy.com/v2/your-api-key
CHAIN_ID=8453

# ===== المحفظة =====
PRIVATE_KEY=your_private_key_here_without_0x
WALLET_ADDRESS=

# ===== إعدادات التداول =====
MIN_LIQUIDITY_USD=5000
MAX_SLIPPAGE_PERCENT=20
GAS_PRICE_MULTIPLIER=1.2
GAS_LIMIT=500000
BUY_AMOUNT_NATIVE=0.01
MAX_SELL_TAX=10
MAX_BUY_TAX=10
CHECK_HONEYPOT=true

# ===== إدارة المخاطر =====
RISK_PER_TRADE=0.02
MAX_CONCURRENT_POSITIONS=3
MAX_TRADES_PER_HOUR=5
MAX_CONSECUTIVE_LOSSES=3
DAILY_LOSS_LIMIT_PERCENT=5

# ===== استراتيجية الخروج =====
TAKE_PROFIT_1=0.25
TAKE_PROFIT_1_PERCENT=30
TAKE_PROFIT_2=0.5
TAKE_PROFIT_2_PERCENT=30
TRAILING_STOP_ACTIVATION=0.3
TRAILING_STOP_DISTANCE=0.1
STOP_LOSS_PERCENT=0.15

# ===== Oracle =====
# عنوان Oracle ETH/USD (يختلف حسب الشبكة)
CHAINLINK_ETH_USD_ADDRESS=0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70

# ===== GoPlus API =====
GOPLUS_API_KEY=your_goplus_api_key_optional

# ===== Telegram =====
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# ===== Paper Trading =====
PAPER_TRADING=false

# ===== قاعدة البيانات =====
DB_PATH=./data/trades.db

# ===== تسجيل العمليات =====
LOG_LEVEL=info
```

---

## 🖥️ أوامر CLI

| الأمر | الوصف |
|-------|-------|
| `npm start` | تشغيل البوت (يقرأ الإعدادات من `.env`). |
| `npm run stop` | إيقاف البوت (يستخدم ملف PID). |
| `npm run status` | عرض حالة البوت والمراكز المفتوحة في الطرفية وإرسالها إلى Telegram. |
| `npm run paper:on` | تفعيل Paper Trading (تعديل مؤقت في الذاكرة). |
| `npm run paper:off` | إيقاف Paper Trading. |
| `npm run network base` | تغيير الشبكة إلى Base (مؤقت، ويمكن استخدام `arbitrum` أو `polygon`). |

**ملاحظة:** تغيير الشبكة عبر CLI مؤقت فقط ولا يعدل ملف `.env` الدائم.

---

## 📈 استراتيجية التداول

### 1. عند ظهور زوج جديد (حدث `PairCreated`):
- يتم تحديد التوكن الجديد (غير WETH).
- تحليل السيولة باستخدام Oracle Chainlink لحساب القيمة بالدولار.
- إذا كانت السيولة أقل من `MIN_LIQUIDITY_USD` → يتم تجاهل الزوج.
- فحص الأمان عبر GoPlus API (إذا مفعل):
  - Honeypot؟ → رفض.
  - ضرائب شراء/بيع أعلى من المسموح؟ → رفض.
  - المالك يمكنه Mint؟ → رفض.
- التحقق من إدارة المخاطر (عدد المراكز، الصفقات في الساعة، إلخ).
- إذا اجتاز جميع الفحوصات → تنفيذ أمر شراء.

### 2. مراقبة المراكز المفتوحة (كل 10 ثوانٍ):
- الحصول على السعر الحالي للتوكن عبر الـ Router.
- تطبيق استراتيجيات الخروج:
  - **Stop Loss**: إذا هبط السعر بنسبة `STOP_LOSS_PERCENT` عن سعر الدخول → بيع الكل.
  - **Take Profit 1**: عند ربح `TAKE_PROFIT_1` (25%) → بيع `TAKE_PROFIT_1_PERCENT` (30%) من الكمية الأصلية.
  - **Take Profit 2**: عند ربح `TAKE_PROFIT_2` (50%) → بيع `TAKE_PROFIT_2_PERCENT` (30%) من الكمية الأصلية.
  - **Trailing Stop**: بعد تفعيل `TRAILING_STOP_ACTIVATION` (30% ربح)، يتم تتبع أعلى سعر. إذا تراجع السعر بنسبة `TRAILING_STOP_DISTANCE` (10%) من القمة → بيع الكمية المتبقية.

---

## ⚠️ إدارة المخاطر

- **الحد الأقصى للصفقات المتزامنة**: `MAX_CONCURRENT_POSITIONS` (يمنع فتح مراكز جديدة إذا تم الوصول للحد).
- **الحد الأقصى للصفقات في الساعة**: `MAX_TRADES_PER_HOUR` (يمنع الإفراط في التداول).
- **الخسائر المتتالية**: `MAX_CONSECUTIVE_LOSSES` (يمكن تطويرها لاحقاً لتوقف البوت مؤقتاً).
- **حد الخسارة اليومي**: `DAILY_LOSS_LIMIT_PERCENT` (نسبة مئوية من الرصيد، قابلة للتطوير).

**ملاحظة:** دوال حساب الخسائر الحالية (`getConsecutiveLosses`, `getTodayLossPercent`) ترجع 0 حاليًا، ويمكن للمطور تطويرها لاحقاً لتصبح فعلية.

---

## 📱 التنبيهات (Telegram)

يتم إرسال تنبيهات فورية إلى حسابك على Telegram للأحداث التالية:
- ✅ نجاح الاتصال بالشبكة.
- ❌ فشل الاتصال أو أخطاء جسيمة.
- 💰 فتح مركز جديد (شراء).
- 📊 تحديث مركز (بيع جزئي أو كلي).
- ⚠️ تحذيرات (مثل تجاوز المخاطر).
- 📈 تقرير دوري بالمراكز المفتوحة (عند استخدام `npm run status`).

**لإعداد Telegram:**
1. احصل على توكن بوت من [@BotFather](https://t.me/BotFather).
2. احصل على معرف الدردشة الخاص بك (يمكنك استخدام [@userinfobot](https://t.me/userinfobot)).
3. أدخل القيم في المتغيرات `TELEGRAM_BOT_TOKEN` و `TELEGRAM_CHAT_ID` في ملف `.env`.

---

## 🧪 وضع Paper Trading

عند تفعيل `PAPER_TRADING=true` في ملف `.env` أو عبر الأمر `npm run paper:on`:
- لا يتم تنفيذ أي معاملات حقيقية على الشبكة.
- يتم محاكاة عمليات الشراء والبيع وتسجيلها في قاعدة البيانات.
- يتم إرسال تنبيهات Telegram مع إشارة (Paper Trade).
- مثالي لاختبار الاستراتيجيات دون مخاطرة مالية.

---

## 🗄️ هيكل قاعدة البيانات

تستخدم قاعدة البيانات **SQLite** ويتم تخزينها في الملف المحدد في `DB_PATH`.

### جدول `positions`
| العمود | النوع | الوصف |
|--------|------|-------|
| id | INTEGER (PK) | معرف فريد للمركز |
| tokenAddress | TEXT | عنوان التوكن |
| pairAddress | TEXT | عنوان الزوج |
| entryPrice | REAL | سعر الدخول (بالعملة الأصلية) |
| amountIn | TEXT | المبلغ المنفق (native) |
| amountOut | TEXT | كمية التوكنات المستلمة |
| entryTime | INTEGER | وقت الدخول (timestamp) |
| status | TEXT | الحالة (open, closed, partial) |
| remainingAmount | TEXT | الكمية المتبقية |
| highestPrice | REAL | أعلى سعر تم الوصول إليه (لـ trailing) |
| soldPortions | TEXT | مصفوفة JSON تحتوي على الأجزاء المباعة |

### جدول `trades`
| العمود | النوع | الوصف |
|--------|------|-------|
| id | INTEGER (PK) | معرف فريد للصفقة |
| positionId | INTEGER | معرف المركز المرتبط (Foreign Key) |
| type | TEXT | نوع الصفقة (buy, sell, partial_sell) |
| price | REAL | السعر عند التنفيذ |
| amount | TEXT | الكمية |
| txHash | TEXT | هاش المعاملة (إذا كانت حقيقية) |
| timestamp | INTEGER | وقت التنفيذ |
| isPaper | BOOLEAN | هل هي صفقة ورقية؟ |

---

## 🔒 نصائح الأمان

1. **استخدم محفظة مخصصة للبوت** برأس مال محدود (لا تضع كل أموالك).
2. **لا تشارك ملف `.env`** مع أي شخص، وتأكد من إضافته إلى `.gitignore`.
3. **جرّب البوت أولاً على شبكة اختبارية** (Testnet) إذا كانت الشبكة المستهدفة تدعم ذلك.
4. **ابدأ بـ Paper Trading** لفترة كافية للتأكد من الاستراتيجية.
5. **تابع سجلات البوت** بانتظام للتأكد من عدم وجود أخطاء غير متوقعة.
6. **احتفظ بنسخة احتياطية** من قاعدة البيانات (`data/trades.db`).

---

## ❓ استكشاف الأخطاء الشائعة

| المشكلة | الحل المحتمل |
|---------|--------------|
| خطأ في الاتصال بـ RPC | تأكد من صحة رابط WebSocket وأن الخدمة فعالة. |
| البوت لا يستمع لأحداث جديدة | تحقق من عنوان الـ Factory وأن الشبكة صحيحة. |
| فشل GoPlus API | قد يكون مؤقتاً، جرب تعطيل `CHECK_HONEYPOT` مؤقتاً. |
| Telegram لا يعمل | تحقق من التوكن ومعرف الدردشة، وتأكد من أن البوت بدأ المحادثة. |
| أخطاء في تقدير الغاز | زد `GAS_LIMIT` أو عدل `GAS_PRICE_MULTIPLIER`. |
| صفقات Paper لا تظهر | تأكد من تفعيل `PAPER_TRADING` وإعادة التشغيل. |

---

## 📞 الدعم والتواصل

إذا واجهت أي مشكلة أو كان لديك استفسار، لا تتردد في التواصل مع المطور:

- **تيليجرام**: [@Abu_jamal777](https://t.me/Abu_jamal777)
- **انستقرام**: [@abujamalhack](https://instagram.com/abujamalhack)

يمكنك أيضاً فتح issue على GitHub إذا كان المشروع منشوراً.

---

## 📜 الترخيص

هذا المشروع مرخص تحت رخصة **MIT**. يمكنك استخدامه وتعديله بحرية، ولكن على مسؤوليتك الخاصة.

---

<p align="center">
  <b>تم التطوير بواسطة أبو جمال عبدالناصر الشوكي</b><br>
  <i>خبير الأمن السيبراني وتطوير أنظمة التداول الآلي</i>
</p>

<p align="center">
  <a href="https://t.me/Abu_jamal777"><img src="https://img.shields.io/badge/Telegram-@Abu_jamal777-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></a>
  <a href="https://instagram.com/abujamalhack"><img src="https://img.shields.io/badge/Instagram-@abujamalhack-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"></a>
</p>

---

**الآن أنت جاهز لبدء رحلة التداول الآلي! 🚀**
