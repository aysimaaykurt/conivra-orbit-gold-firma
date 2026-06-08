# Conivra Orbit Gold - Backend Entegrasyon Dokümanı

Bu doküman, Conivra Orbit Gold Firma portalı frontend uygulaması ile backend arasında tam uyumluluk sağlamak amacıyla hazırlanmıştır. Uygulama genelinde kullanılan tüm API servisleri, endpoint adresleri, HTTP metodları, sayfalama, arama, filtreleme query parametreleri ve detaylı DTO (Data Transfer Object) yapıları aşağıda detaylandırılmıştır.

---

## 📌 Genel Standartlar ve Mimari Yapı

### 1. Base URL ve İstek Yapısı
* **Base URL:** Varsayılan olarak `http://localhost:5000` veya `.env` içerisindeki `NEXT_PUBLIC_API_BASE_URL` değişkeni.
* **Content-Type:** Standart istekler için `application/json` kullanılır. İlan, hediye kiti ve workshop kayıtlarında dosya yükleme işlemlerinden ötürü `multipart/form-data` formatı geçerlidir.

### 2. Yetkilendirme (Authentication)
Tüm korumalı endpoint'lerde HTTP **Authorization** header'ı içinde JWT token gönderilmelidir:
```http
Authorization: Bearer <token>
```

### 3. Genel Yanıt Formatı (Standard Response Wrapper)
Backend servislerinin standart (sayfalamasız) başarılı veya başarısız işlemler için döneceği ortak JSON şablonu şu şekildedir:

```json
{
  "success": true,   // İşlemin başarı durumu (true/false)
  "message": "İşlem başarıyla gerçekleştirildi", // Kullanıcıya gösterilecek mesaj
  "data": {}         // İlgili veri objesi veya dizisi (Hata durumunda boş veya null olabilir)
}
```

---

## 📄 4. Sayfalama (Pagination), Arama ve Filtreleme Standartları

Frontend üzerindeki listeleme tabloları (İlanlar, Başvurular, Destek Talepleri vb.) sunucu taraflı arama, filtreleme ve sayfalama yapısına uyumludur. Backend ekibinin tüm `GET` listeleme isteklerinde aşağıdaki standartları uygulaması gerekmektedir.

### 4.1. Ortak Sorgu (Query) Parametreleri

Tüm liste getiren `GET` endpointleri için desteklenmesi gereken standart query parametreleri:

| Parametre | Veri Tipi | Açıklama | Varsayılan Değer | Zorunlu mu? |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `Integer` | Getirilmek istenen aktif sayfa numarası (1-indexed). | `1` | Hayır |
| `pageSize` | `Integer` | Sayfa başına çekilecek kayıt/satır sayısı. | `10` | Hayır |
| `searchTerm` | `String` | İlan başlığı, açıklama veya ad-soyad gibi alanlarda kısmi arama (kasa duyarsız / case-insensitive). | Boş (Arama yok) | Hayır |
| `sortBy` | `String` | Sıralamaya esas olacak alan adı (örn: `createDate`, `title`). | `createDate` | Hayır |
| `sortOrder` | `String` | Sıralama yönü: `asc` (A-Z / Eskiden Yeniye) veya `desc` (Z-A / Yeniden Eskiye). | `desc` | Hayır |

### 4.2. Sayfalanmış Yanıt Şablonu (Paginated Response Wrapper DTO)

Sayfalama içeren tüm listeleme endpoint'lerinde `data` nesnesi doğrudan dizi dönmek yerine aşağıdaki yapıda sarmalanmalıdır:

```json
{
  "success": true,
  "message": "Kayıtlar başarıyla listelendi",
  "data": {
    "items": [
      // İlgili modele ait kayıt nesneleri dizisi
    ],
    "pagination": {
      "currentPage": 1,   // Aktif sayfa numarası
      "pageSize": 10,     // Sayfa başına kayıt sayısı
      "totalItems": 45,   // Veritabanındaki filtrelere uyan toplam kayıt sayısı
      "totalPages": 5     // Toplam sayfa sayısı (totalItems / pageSize yukarı yuvarlanmış)
    }
  }
}
```

> [!TIP]  
> Frontend uygulamamız geliştirme sürecinde geriye dönük uyumluluk adına hem doğrudan dizi (`[]`) halindeki mock verileri hem de yukarıdaki sarmalanmış (`pagination`) nesnesini okuyabilecek esnekliğe sahiptir. Backend'in yukarıdaki standart sarmalayıcıyı dönmesi kesinlikle önerilir.

---

## 🔑 1. Kimlik Doğrulama Servisleri (Auth Services)

Tüm auth servisleri `src/api/auth/` dizininde tanımlanmıştır.

### 1.1. Giriş Yap (Login)
* **URL:** `/api/v2/auth/login`
* **Metot:** `POST`
* **Açıklama:** Kullanıcının portala giriş yapmasını sağlar ve JWT Token ile firma bilgilerini döner.

#### Örnek Giriş DTO (Request):
```json
{
  "email": "test@conivra.com",
  "password": "strongPassword123"
}
```

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Giriş başarılı",
  "data": {
    "token": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiration": "2026-05-18T22:45:00.000Z"
    },
    "user": {
      "id": 1,
      "tenantId": 1,
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "email": "test@conivra.com",
      "phone": "05555555555",
      "status": true,
      "subscriptionStatus": "gold"
    },
    "tenantId": 1,
    "tenantName": "Conivra Orbit Gold Firma"
  }
}
```

---

### 1.2. Kayıt Ol (Register)
* **URL:** `auth/register`
* **Metot:** `POST`
* **Açıklama:** Yeni bir firmanın platforma kayıt olmasını sağlar.

#### Örnek Giriş DTO (Request):
```json
{
  "company": "Orbit Teknoloji A.Ş.",
  "sector": "restaurant",
  "fullName": "Ahmet Yılmaz",
  "email": "test@conivra.com",
  "gender": "male",
  "birthDate": "1990-05-15",
  "city": "izmir",
  "district": "konak",
  "password": "strongPassword123",
  "referral": "REF-5541",
  "branchConfirm": true,
  "kvkk": true
}
```

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Kayıt işlemi başarıyla tamamlandı",
  "data": {
    "user": {
      "id": 1,
      "tenantId": 1,
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "email": "test@conivra.com",
      "phone": "",
      "status": true,
      "subscriptionStatus": "gold"
    },
    "token": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiration": "2026-05-18T22:45:00.000Z"
    }
  }
}
```

---

### 1.3. Mevcut Kullanıcı Bilgileri (Get Current User / Me)
* **URL:** `auth/me`
* **Metot:** `GET`
* **Açıklama:** İstek başlığındaki JWT token'a ait kullanıcı profili ve bağlı olduğu organizasyon listesini getirir.

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Kullanıcı bilgileri başarıyla alındı",
  "data": {
    "user": {
      "id": 1,
      "tenantId": 1,
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "email": "test@conivra.com",
      "phone": "05555555555",
      "status": true,
      "subscriptionStatus": "gold"
    },
    "organizations": [
      {
        "id": 101,
        "name": "Alsancak Şubesi",
        "code": "ALS01",
        "description": "Alsancak Merkez Şube",
        "address": "Kültür Mah. No:42 Alsancak",
        "city": "izmir",
        "country": "türkiye",
        "phoneNumber": "02324445566",
        "email": "alsancak@conivra.com",
        "isActive": true,
        "parentId": null,
        "parentName": null,
        "createDate": "2026-05-01T12:00:00Z"
      }
    ]
  }
}
```

---

### 1.4. Şifre Sıfırlama Kodu Gönder (Send Password Mail)
* **URL:** `auth/sendPasswordMail`
* **Metot:** `POST`
* **Açıklama:** Kullanıcının e-posta adresine doğrulama kodu gönderilmesini tetikler.

#### Örnek Giriş DTO (Request):
```json
{
  "email": "test@conivra.com",
  "oldPassword": "temporaryOrOldPassword"
}
```

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Şifre sıfırlama doğrulama kodu e-postanıza gönderilmiştir."
}
```

---

### 1.5. Şifre Değiştir (Change Password)
* **URL:** `auth/changePassword`
* **Metot:** `POST`
* **Açıklama:** E-posta ile gönderilen doğrulama kodu kullanılarak yeni şifrenin tanımlanmasını sağlar.

#### Örnek Giriş DTO (Request):
```json
{
  "verificationCode": "123456",
  "newPassword": "newStrongPassword123",
  "confirmPassword": "newStrongPassword123"
}
```

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Şifreniz başarıyla güncellendi."
}
```

---

## 📋 2. Başvuru Yönetimi (Applications & Evaluations)

Başvuru ve değerlendirme servisleri `src/api/applications/` dizininde tanımlanmıştır.

### 2.1. Detaylı Başvuru Listesi
* **URL:** `applications`
* **Metot:** `GET`
* **Açıklama:** Firmanın aktif ilanlarına influencer'lar tarafından yapılan başvuruların detaylı listesidir.

#### Query Parametreleri:
| Parametre | Veri Tipi | Açıklama | Varsayılan |
| :--- | :--- | :--- | :--- |
| `page` | `Integer` | Aktif sayfa numarası. | `1` |
| `pageSize` | `Integer` | Sayfa başına kayıt sayısı. | `10` |
| `searchTerm` | `String` | Influencer adı (`fullName`) veya konumu (`location`) içinde arama yapar. | - |
| `adType` | `String` | İlan kategorisine göre filtreleme: `soiree-menu`, `beach-cocktail`, `soiree-breakfast` vb. | - |
| `status` | `Integer` | Başvuru durumu filtresi (1: Bekliyor, 2: Onaylandı, 3: Reddedildi). | - |
| `sortBy` | `String` | Sıralama alanı (örn: `fullName`, `followerCount`, `createDate`). | `createDate` |
| `sortOrder` | `String` | Sıralama yönü: `asc` veya `desc`. | `desc` |

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Başvurular listelendi",
  "data": {
    "items": [
      {
        "id": "app-101",
        "adType": "soiree-menu",
        "profileImageSrc": "/assets/profiles/influencer1.jpg",
        "fullName": "Merve Yılmaz",
        "followerCount": "125.4K",
        "location": "izmir",
        "socialMedia": {
          "instagram": true,
          "tiktok": false,
          "youtube": true
        },
        "status": 1 // 1: Bekliyor (PENDING), 2: Onaylandı (APPROVED), 3: Reddedildi (REJECTED)
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

### 2.2. Başvuru Durumunu Güncelle
* **URL:** `applications/:id`
* **Metot:** `PUT`
* **Açıklama:** İlgili başvuru kimliği (`id`) üzerinden başvurunun onaylanması veya reddedilmesini sağlar.

#### Örnek Giriş DTO (Request):
```json
{
  "status": 2 // 1: Bekliyor, 2: Onaylandı, 3: Reddedildi
}
```

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Başvuru durumu başarıyla güncellendi.",
  "data": {
    "id": "app-101",
    "status": 2
  }
}
```

---

### 2.3. Dashboard Basit Başvuru Listesi
* **URL:** `company/dashboard/applications`
* **Metot:** `GET`
* **Açıklama:** Dashboard ana sayfasında gösterilen son başvuruların özet listesidir. Sayfalama içermez, son 5 kaydı döner.

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Başarılı",
  "data": [
    {
      "id": "app-101",
      "email": "merve@influencer.com",
      "title": "Merve Yılmaz",
      "description": "Akşam Yemeği Menüsü İlanı için başvurdu.",
      "timeAgo": "2 saat önce"
    }
  ]
}
```

---

### 2.4. Değerlendirme Oluştur (Create Evaluation)
* **URL:** `applications/Evaluation`
* **Metot:** `POST`
* **Açıklama:** Tamamlanan iş birliği sonrasında influencer hakkında değerlendirme puanları ve geri dönüş anket verileri kaydeder.

#### Örnek Giriş DTO (Request):
```json
{
  "applicationId": "app-101",
  "influencerId": "inf-99",
  "serviceSatisfaction": 5, // 1-5 puan arası
  "collaborationEffectiveness": 4, // 1-5 puan arası
  "agreementAdherence": "yes", // "yes" veya "no"
  "agreementExplanation": "İçerikler vaktinde ve kaliteli çekimlerle paylaşıldı.",
  "effects": {
    "followerIncrease": true,
    "similarCollaborations": false,
    "likeIncrease": true,
    "viewIncrease": true
  }
}
```

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Değerlendirme başarıyla kaydedildi.",
  "data": {
    "id": "eval-500",
    "applicationId": "app-101",
    "influencerId": "inf-99"
  }
}
```

---

### 2.5. Değerlendirme Getir (Get Evaluation)
* **URL:** `applications/Evaluation/:id`
* **Metot:** `GET`
* **Açıklama:** Kaydedilen bir değerlendirmenin detaylarını ID parametresi ile çeker.

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "id": "eval-500",
    "applicationId": "app-101",
    "influencerId": "inf-99",
    "serviceSatisfaction": 5,
    "collaborationEffectiveness": 4,
    "agreementAdherence": "yes",
    "agreementExplanation": "İçerikler vaktinde ve kaliteli çekimlerle paylaşıldı.",
    "effects": {
      "followerIncrease": true,
      "similarCollaborations": false,
      "likeIncrease": true,
      "viewIncrease": true
    },
    "createDate": "2026-05-15T18:30:00Z"
  }
}
```

---

## 📢 3. İlan Yönetimi (Advertisements)

İlan (Kampanya, Hediye Kiti ve Workshop) servisleri `src/api/advertisements/` dizininde tanımlanmıştır. Tüm ekleme ve güncelleme servisleri **resim dosyası yüklemesi içerebildiğinden** HTTP isteği `multipart/form-data` formatında yapılmalı ve DTO alanları FormData key-value çiftleri olarak gönderilmelidir.

---

### 3.1. Kampanya/İlan Servisleri (Advertisements)

#### 3.1.1. Yeni Kampanya İlanı Ekle
* **URL:** `Advertisements/addAd`
* **Metot:** `POST`
* **Content-Type:** `multipart/form-data`

##### FormData Yapısı (Request):
* `title` (string): İlan başlığı.
* `description` (string): İlan detay açıklaması.
* `startDate` (string, ISO 8601): Başlangıç tarihi.
* `endDate` (string, ISO 8601): Bitiş tarihi.
* `city` (string): İl.
* `district` (string): İlçe.
* `address` (string): Tam adres.
* `sector` (string): Sektör (Örn: `restaurant`, `hotel`).
* `category` (string): Kategori.
* `services` (string): Sunulacak servisler/ikramlar (Virgülle ayrılmış veya JSON formatında string).
* `guestCount` (string): Beraberinde getirebileceği kişi sayısı.
* `platformPreference` (string): Tercih edilen sosyal medya mecrası (Örn: `Instagram`).
* `followerRange` (string): Beklenen takipçi aralığı (Örn: `10k-50k`).
* `contentType` (string): Beklenen içerik türü (Örn: `Reels & Story`).
* `businessType` (string): İş modeli/Sözleşme tipi.
* `image` (File, opsiyonel): İlan görsel dosyası.

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "İlan başarıyla oluşturuldu.",
  "data": {
    "id": "ad-301",
    "title": "Alsancak Şubesi Akşam Yemeği Menüsü Lansmanı",
    "imageUrl": "/uploads/advertisements/ad-301.jpg"
  }
}
```

---

#### 3.1.2. Kampanya İlanını Güncelle
* **URL:** `Advertisements/addAd/:id`
* **Metot:** `PUT`
* **Content-Type:** `multipart/form-data`
* **Açıklama:** İlgili ilan kimliği (`id`) üzerinden kampanya bilgilerini günceller. İstek yapısı ekleme servisinin aynısıdır.

---

#### 3.1.3. Tekil İlan Detayı
* **URL:** `Advertisements/addAd/:id`
* **Metot:** `GET`
* **Açıklama:** Kimliği belirtilen kampanya ilanının tüm detaylarını getirir.

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "id": "ad-301",
    "title": "Alsancak Şubesi Akşam Yemeği Menüsü Lansmanı",
    "description": "Menümüzün influencerlar tarafından deneyimlenmesi ilanımızdır.",
    "startDate": "2026-06-01T00:00:00Z",
    "endDate": "2026-06-15T00:00:00Z",
    "city": "izmir",
    "district": "konak",
    "address": "Alsancak Mh. No:42",
    "sector": "restaurant",
    "category": "dinner",
    "services": "Limitsiz Meze, Ana Yemek, Tatlı İkramı",
    "guestCount": "+1",
    "platformPreference": "Instagram",
    "followerRange": "10k-50k",
    "contentType": "Reels",
    "businessType": "Barter",
    "imageUrl": "/uploads/advertisements/ad-301.jpg",
    "createDate": "2026-05-17T12:00:00Z",
    "status": "active"
  }
}
```

---

#### 3.1.4. Kampanya İlanları Listesi
* **URL:** `Advertisements/addAd`
* **Metot:** `GET`
* **Açıklama:** Firmanın oluşturduğu kampanya ilanlarının filtrelenmiş ve sayfalanmış listesidir.

##### Query Parametreleri:
| Parametre | Veri Tipi | Açıklama | Varsayılan |
| :--- | :--- | :--- | :--- |
| `page` | `Integer` | Aktif sayfa numarası. | `1` |
| `pageSize` | `Integer` | Sayfa başına kayıt sayısı. | `10` |
| `searchTerm` | `String` | İlan başlığı (`title`) veya açıklamasında (`description`) arama. | - |
| `city` | `String` | Şehre göre filtreleme. | - |
| `district` | `String` | İlçeye göre filtreleme. | - |
| `status` | `String` | İlan durumu (`active`, `inactive`, `pending`). | - |
| `sortBy` | `String` | Sıralama alanı (`createDate`, `title`, `startDate`). | `createDate` |
| `sortOrder` | `String` | Sıralama yönü (`asc` veya `desc`). | `desc` |

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ad-301",
        "title": "Alsancak Şubesi Akşam Yemeği Menüsü Lansmanı",
        "imageUrl": "/uploads/advertisements/ad-301.jpg",
        "startDate": "2026-06-01T00:00:00Z",
        "endDate": "2026-06-15T00:00:00Z",
        "city": "izmir",
        "district": "konak",
        "status": "active"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

### 3.2. Hediye Kiti Servisleri (Gift Kits)

#### 3.2.1. Yeni Hediye Kiti Ekle
* **URL:** `Advertisements/addGiftKit`
* **Metot:** `POST`
* **Content-Type:** `multipart/form-data`

##### FormData Yapısı (Request):
* `title` (string): Hediye paketi adı.
* `content` (string): Paket içeriği açıklaması.
* `category` (string): Kategori.
* `targetAudience` (string): Hedef kitle tanımı.
* `followerRange` (string): Beklenen takipçi aralığı.
* `platformPreference` (string): Sosyal medya mecrası.
* `businessType` (string): İş modeli.
* `contentType` (string): İstenen paylaşım türü.
* `image` (File, opsiyonel): Ürün veya paket görseli.

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Hediye kiti başarıyla kaydedildi.",
  "data": {
    "id": "gift-401",
    "title": "Premium Kahve ve Kupa Tanıtım Seti",
    "imageUrl": "/uploads/giftkits/gift-401.jpg"
  }
}
```

---

#### 3.2.2. Hediye Kitini Güncelle
* **URL:** `Advertisements/addGiftKit/:id`
* **Metot:** `PUT`
* **Content-Type:** `multipart/form-data`

---

#### 3.2.3. Hediye Kitleri Listesi
* **URL:** `Advertisements/addGiftKit`
* **Metot:** `GET`
* **Açıklama:** Firmanın tanımladığı hediye kiti ilanlarının filtrelenmiş ve sayfalanmış listesidir.

##### Query Parametreleri:
| Parametre | Veri Tipi | Açıklama | Varsayılan |
| :--- | :--- | :--- | :--- |
| `page` | `Integer` | Aktif sayfa. | `1` |
| `pageSize` | `Integer` | Sayfa boyutu. | `10` |
| `searchTerm` | `String` | Kit başlığı (`title`) veya paket içeriğinde (`content`) arama. | - |
| `category` | `String` | Hediye kiti kategorisi. | - |
| `status` | `String` | Durum filtresi (`active`, `inactive`). | - |
| `sortBy` | `String` | Sıralama alanı (`createDate`, `title`). | `createDate` |
| `sortOrder` | `String` | Sıralama yönü (`asc` veya `desc`). | `desc` |

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "gift-401",
        "title": "Premium Kahve ve Kupa Tanıtım Seti",
        "content": "Çekirdek kahve, özel tasarım porselen kupa.",
        "category": "food-beverage",
        "targetAudience": "Kahve severler, Lifestyle",
        "followerRange": "5k+",
        "platformPreference": "Instagram",
        "businessType": "Barter",
        "contentType": "Story",
        "imageUrl": "/uploads/giftkits/gift-401.jpg",
        "status": "active"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

### 3.3. Workshop Servisleri (Workshops)

#### 3.3.1. Yeni Workshop Ekle
* **URL:** `Advertisements/addWorkshop`
* **Metot:** `POST`
* **Content-Type:** `multipart/form-data`

##### FormData Yapısı (Request):
* `title`, `description`, `startDate`, `endDate`, `duration` (string: Örn: `2 saat`), `city`, `district`, `address`, `category`, `targetAudience`, `participantCount`, `participationCondition`, `fee` (string, Ücretli/Ücretsiz durumları için), `contentType`, `workshopGoal`, `workshopContent`, `image` (File, opsiyonel).

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Workshop başarıyla oluşturuldu.",
  "data": {
    "id": "work-201",
    "title": "Barista 101 - Latte Art Workshop'u",
    "imageUrl": "/uploads/workshops/work-201.jpg"
  }
}
```

---

#### 3.3.2. Workshop Güncelle
* **URL:** `Advertisements/addWorkshop/:id`
* **Metot:** `PUT`
* **Content-Type:** `multipart/form-data`

---

#### 3.3.3. Workshop Listesi
* **URL:** `Advertisements/addWorkshop`
* **Metot:** `GET`
* **Açıklama:** Firmanın düzenlediği workshop etkinliklerinin listesidir.

##### Query Parametreleri:
| Parametre | Veri Tipi | Açıklama | Varsayılan |
| :--- | :--- | :--- | :--- |
| `page` | `Integer` | Aktif sayfa. | `1` |
| `pageSize` | `Integer` | Sayfa boyutu. | `10` |
| `searchTerm` | `String` | Başlık (`title`) veya açıklama (`description`) içinde arama. | - |
| `city` | `String` | Şehre göre filtreleme. | - |
| `sortBy` | `String` | Sıralama alanı (`createDate`, `startDate`, `title`). | `createDate` |
| `sortOrder` | `String` | Sıralama yönü (`asc` veya `desc`). | `desc` |

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "work-201",
        "title": "Barista 101 - Latte Art Workshop'u",
        "description": "Katılımcı influencerlar kendi lattelerini hazırlayacaktır.",
        "startDate": "2026-06-10T14:00:00Z",
        "endDate": "2026-06-10T16:00:00Z",
        "duration": "2 saat",
        "city": "izmir",
        "district": "konak",
        "fee": "Ücretsiz (Barter)",
        "imageUrl": "/uploads/workshops/work-201.jpg"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

## 📊 5. Dashboard ve Analitik (Dashboard Stats)

Dashboard veri servisleri `src/api/company/dashboard/` dizininde tanımlanmıştır.

### 5.1. Dashboard İstatistik Kartları (Stats)
* **URL:** `company/dashboard/stats`
* **Metot:** `GET`
* **Açıklama:** Firmanın ana sayfadaki özet metriklerini (aktif ilanlar, toplam bütçe, gerçekleşen iş birlikleri vb.) PrimeIcons sınıf isimleri ve renk kodlarıyla döner. Sayfalama içermez.

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Başarılı",
  "data": [
    {
      "id": "card-1",
      "title": "Aktif Kampanyalar",
      "description": "Devam eden aktif ilan sayınız",
      "value": 12,
      "icon": "pi pi-megaphone",
      "color": "#FFC107"
    },
    {
      "id": "card-2",
      "title": "Toplam Başvuru",
      "description": "Tüm ilanlara yapılan başvurular",
      "value": 248,
      "icon": "pi pi-users",
      "color": "#4CAF50"
    }
  ]
}
```

---

### 5.2. En Çok Tercih Edilen İlanlar (Most Preferred)
* **URL:** `company/dashboard/mostPreferred`
* **Metot:** `GET`
* **Açıklama:** En çok ilgi gören ve influencer başvurusu alan popüler ilanların listesidir.

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Başarılı",
  "data": [
    {
      "id": "pref-1",
      "name": "Barista Latte Art Workshop",
      "status": "Yüksek İlgi"
    },
    {
      "id": "pref-2",
      "name": "Alsancak Kahvaltı İlanı",
      "status": "Normal İlgi"
    }
  ]
}
```

---

## 🏢 6. Firma Profil Yönetimi (Company Profile)

Profil servisleri `src/api/company/profile/` dizininde tanımlanmıştır.

### 5.1. Firma Profilini Güncelle
* **URL:** `company/profile` veya `company/profile/:id` (PUT ile)
* **Metot:** `POST` veya `PUT`
* **Açıklama:** Firmanın unvan, hakkında yazısı, adres ve sektör bilgilerini günceller.

#### Örnek Giriş DTO (Request):
```json
{
  "companyName": "Conivra Orbit Gold Alsancak Şubesi",
  "aboutCompany": "Yeni nesil kahve deneyimini, modern mimariyle Alsancak merkezinde sunuyoruz.",
  "city": "izmir",
  "district": "konak",
  "address": "Kültür Mah. Şehitler Cad. No: 42 Alsancak",
  "sector": "restaurant"
}
```

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Profil başarıyla güncellendi.",
  "data": {
    "id": "prof-100",
    "companyName": "Conivra Orbit Gold Alsancak Şubesi"
  }
}
```

---

### 5.2. Firma Profili Getir
* **URL:** `company/profile`
* **Metot:** `GET`
* **Açıklama:** Giriş yapan firmaya ait profil detaylarını döndürür.

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "id": "prof-100",
    "companyName": "Conivra Orbit Gold Alsancak Şubesi",
    "aboutCompany": "Yeni nesil kahve deneyimini, modern mimariyle Alsancak merkezinde sunuyoruz.",
    "city": "izmir",
    "district": "konak",
    "address": "Kültür Mah. Şehitler Cad. No: 42 Alsancak",
    "sector": "restaurant",
    "createDate": "2026-05-01T10:00:00Z"
  }
}
```

---

### 5.3. Firma Profil İstatistikleri (Profile Info)
* **URL:** `company/profileInfo`
* **Metot:** `GET`
* **Açıklama:** Firmanın tamamlanan, bekleyen ve iptal edilen işleriyle alakalı sayısal istatistik dökümünü çeker.

#### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "activeAds": 4,
    "totalApplications": 32,
    "favoriteInfluencers": 15,
    "totalJobs": 40,
    "completedJobs": 28,
    "pendingJobs": 9,
    "cancelledJobs": 3
  }
}
```

---

## 🛠️ 7. Destek ve Talep Yönetimi (Support & Requests)

Destek (support) ve Talep (request) servisleri sırasıyla `src/api/company/support/` ve `src/api/company/request/` dizinlerinde tanımlanmıştır.

### 7.1. Destek Bildirimleri (Support)

#### 7.1.1. Yeni Destek Talebi Aç
* **URL:** `company/support`
* **Metot:** `POST`

##### Örnek Giriş DTO (Request):
```json
{
  "title": "Gold Statü Avantajları Tanımı",
  "type": "Genel Soru",
  "description": "Gold paketteki öne çıkma kuralı hakkında bilgi almak istiyoruz."
}
```

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Destek talebiniz başarıyla oluşturulmuştur.",
  "data": {
    "id": "sup-901",
    "title": "Gold Statü Avantajları Tanımı",
    "type": "Genel Soru"
  }
}
```

---

#### 7.1.2. Destek Talepleri Listesi
* **URL:** `company/support`
* **Metot:** `GET`
* **Açıklama:** Firmanın açmış olduğu destek taleplerini durumuyla birlikte listeler.

##### Query Parametreleri:
| Parametre | Veri Tipi | Açıklama | Varsayılan |
| :--- | :--- | :--- | :--- |
| `page` | `Integer` | Aktif sayfa. | `1` |
| `pageSize` | `Integer` | Sayfa boyutu. | `10` |
| `searchTerm` | `String` | Destek başlığı (`title`) veya açıklamasında (`description`) arama. | - |
| `type` | `String` | Destek kategorisi (Örn: `Genel Soru`, `Entegrasyon`). | - |
| `status` | `String` | Destek durum enum filtresi: `beklemede`, `işlemde`, `cevaplandı`, `çözüldü`, `iptal`. | - |

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sup-901",
        "title": "Gold Statü Avantajları Tanımı",
        "type": "Genel Soru",
        "description": "Gold paketteki öne çıkma kuralı hakkında bilgi almak istiyoruz.",
        "status": "cevaplandı",
        "createDate": "2026-05-11T11:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

### 7.2. Teknik/Finans/Pazarlama Talepleri (Requests)

#### 7.2.1. Yeni Talep Oluştur
* **URL:** `company/request`
* **Metot:** `POST`

##### Örnek Giriş DTO (Request):
```json
{
  "title": "Mekan İçi Ekran Bağlantı Hatası",
  "type": "Teknik Destek",
  "description": "Girişte bulunan ana menü yansıtma ekranında sinyal hatası alıyoruz."
}
```

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "message": "Talebiniz başarıyla oluşturuldu.",
  "data": {
    "id": "req-801",
    "title": "Mekan İçi Ekran Bağlantı Hatası",
    "type": "Teknik Destek"
  }
}
```

---

#### 7.2.2. Talepler Listesi
* **URL:** `company/request`
* **Metot:** `GET`
* **Açıklama:** Firmanın teknik, idari ve finansal taleplerini ve süreç durumlarını getirir.

##### Query Parametreleri:
| Parametre | Veri Tipi | Açıklama | Varsayılan |
| :--- | :--- | :--- | :--- |
| `page` | `Integer` | Aktif sayfa. | `1` |
| `pageSize` | `Integer` | Sayfa boyutu. | `10` |
| `searchTerm` | `String` | Talep başlığı (`title`) veya açıklamasında (`description`) arama. | - |
| `type` | `String` | Talep kategorisi (Örn: `Teknik Destek`, `Finans`, `Pazarlama`). | - |
| `status` | `String` | Talep durum enum filtresi: `beklemede`, `işlemde`, `çözüldü`, `iptal`. | - |

##### Örnek Çıkış DTO (Response):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "req-801",
        "title": "Mekan İçi Ekran Bağlantı Hatası",
        "type": "Teknik Destek",
        "description": "Girişte bulunan ana menü yansıtma ekranında sinyal hatası alıyoruz.",
        "status": "beklemede",
        "createDate": "2026-05-10T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

> [!NOTE]  
> Bu dokümandaki veri tipleri ve endpoint adresleri `src/api` altındaki TypeScript arayüzlerinden birebir türetilmiştir. Backend geliştiricilerin bu dokümana göre API endpoints ve modellerini oluşturmaları, frontend entegrasyonunun sıfır hata ile tamamlanmasını sağlayacaktır.
