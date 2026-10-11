const express = require('express'); // تم تصحيح حرف الـ C هنا
const app = express();
const port = 3001;
const mongoose = require('mongoose');

// إعدادات استقبال البيانات من الفورم
app.use(express.urlencoded({ extended: true }));

// استدعاء ملف البيانات (Schema)
const Mydata = require("./models/mydataSchema");
app.set('view engine', 'ejs');

// الاتصال بقاعدة بيانات MongoDB
mongoose.connect('mongodb+srv://ron_06:Le88kB7LgG3lSR2D@cluster0.afdjyio.mongodb.net/all-data?appName=Cluster0')
  .then(() => {
    // تشغيل السيرفر فقط بعد نجاح الاتصال
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// مسار GET لعرض صفحة HTML (الفورم)
app.get("/", (req, res) => {
  Mydata.find()
    .then((result) => {
      console.log(result);
      // تم نقل الرد هنا ليعمل بعد جلب البيانات بنجاح
      res.render("home", { mytitle: "home page" }); 
    })
    .catch((err) => { // تم إصلاح صياغة الـ catch وربطها بالـ then
      console.log(err);
    });
});

// مسار POST لاستقبال البيانات وحفظها في قاعدة البيانات
app.post("/", (req, res) => {
  // 1. أخذ البيانات من الفورم
  const mydata = new Mydata(req.body);

  // 2. أمر الحفظ في قاعدة بيانات MongoDB
  mydata.save()
    .then(() => {
      // 3. إعادة توجيه المستخدم للصفحة الرئيسية لإنهاء الدوران
      res.redirect("/");
    })
    .catch((err) => {
      // 4. طباعة أي خطأ قد يحدث أثناء الحفظ
      console.log(err);
    });
});