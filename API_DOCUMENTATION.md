# Backend API Dokümantasyonu

Bu dosya, frontend'de kullanılan tüm API servisleri için backend geliştiricisine gerekli endpoint ve format bilgilerini içerir.

---

## Base URL

```
http://localhost:5000
```

**Not:** Tüm endpoint'ler için `Content-Type: application/json` header'ı gereklidir.

---

## Authentication Endpoints

### 1. Login (Kullanıcı Girişi)

**Endpoint:** `POST /api/v2/auth/login`

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": {
      "token": "string (JWT token)",
      "expiration": "string (ISO 8601 date format)"
    },
    "user": {
      "id": "number",
      "tenantId": "number",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "status": "boolean",
      "subscriptionStatus": "string (optional) - Abonelik durumu ('gold', 'premium', 'silver', 'bronze', vb.)"
    },
    "tenantId": "number",
    "tenantName": "string"
  },
  "message": "string"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Kullanıcı bulunamadı' veya 'Şifre hatalı')"
}
```

**Notlar:**
- Email ve password doğrulaması yapılmalı
- Başarılı girişte JWT token oluşturulmalı
- Token expiration süresi belirlenmeli (örn: 60 dakika)
- User bilgileri ve tenant bilgileri response'da dönmeli

---

### 2. Register (Kullanıcı Kaydı)

**Endpoint:** `POST auth/register`

**Request Body:**
```json
{
  "company": "string (required) - Firma adı",
  "sector": "string (required) - Sektör",
  "fullName": "string (required) - Ad Soyad",
  "email": "string (required) - Email adresi",
  "gender": "string (required) - Cinsiyet",
  "birthDate": "string (required) - Doğum tarihi (ISO 8601 veya YYYY-MM-DD formatı)",
  "city": "string (required) - İl",
  "district": "string (required) - İlçe",
  "password": "string (required) - Minimum 6 karakter",
  "referral": "string (optional) - Referans kodu",
  "branchConfirm": "boolean (required) - Referans kodunu girmiş olduğum firmanın bir şubesiyim",
  "kvkk": "boolean (required) - KVKK onayı (true olmalı)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number",
      "tenantId": "number",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "status": "boolean",
      "subscriptionStatus": "string (optional) - Abonelik durumu ('gold', 'premium', 'silver', 'bronze', vb.)"
    },
    "token": {
      "token": "string (JWT token) - Opsiyonel, eğer otomatik login yapılacaksa",
      "expiration": "string (ISO 8601 date format)"
    }
  },
  "message": "string"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Email zaten kullanılıyor', 'Geçersiz referans kodu', vb.)"
}
```

**Notlar:**
- Email unique olmalı (duplicate kontrolü)
- Password minimum 6 karakter olmalı
- KVKK onayı zorunlu (false ise hata dönmeli)
- Referans kodu varsa doğrulanmalı
- branchConfirm true ise, referral koduna göre parent tenant ilişkisi kurulmalı
- Başarılı kayıt sonrası otomatik login yapılacaksa token dönmeli

---

### 3. Get Current User (Kullanıcı Bilgileri ve Organizasyonlar)

**Endpoint:** `GET auth/me`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number",
      "tenantId": "number",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "status": "boolean",
      "subscriptionStatus": "string (optional) - Abonelik durumu ('gold', 'premium', 'silver', 'bronze', vb.)"
    },

  },
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcı bilgileri dönmeli
- `subscriptionStatus` opsiyoneldir ve kullanıcının abonelik durumunu gösterir (örn: "gold", "premium", "silver", "bronze")
- `subscriptionStatus` null veya undefined olabilir (abonelik yoksa)

---

### 4. Send Password Mail (Şifre Sıfırlama Kodu Gönderme)

**Endpoint:** `POST auth/sendPasswordMail`

**Request Body:**
```json
{
  "email": "string (required) - Kullanıcı email adresi",
  "oldPassword": "string (required) - Eski şifre"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Doğrulama kodu email adresinize gönderildi)"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Email bulunamadı', 'Şifre hatalı', vb.)"
}
```

**Notlar:**
- Email ve eski şifre doğrulanmalı
- Doğrulama kodu oluşturulmalı (6 haneli)
- Doğrulama kodu email adresine gönderilmeli
- Doğrulama kodunun geçerlilik süresi belirlenmeli (örn: 10 dakika)
- Aynı email için kısa süre içinde birden fazla kod isteği yapılırsa rate limiting uygulanabilir

---

### 5. Change Password (Şifre Değiştirme)

**Endpoint:** `POST auth/changePassword`

**Request Body:**
```json
{
  "verificationCode": "string (required) - 6 haneli doğrulama kodu",
  "newPassword": "string (required) - Yeni şifre (minimum 6 karakter)",
  "confirmPassword": "string (required) - Yeni şifre tekrarı"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Şifre başarıyla değiştirildi)"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Geçersiz doğrulama kodu', 'Doğrulama kodu süresi dolmuş', 'Şifreler eşleşmiyor', vb.)"
}
```

**Notlar:**
- Doğrulama kodu kontrol edilmeli
- Doğrulama kodunun süresi dolmamış olmalı
- newPassword ve confirmPassword eşleşmeli
- Yeni şifre minimum 6 karakter olmalı
- Şifre değiştirildikten sonra doğrulama kodu geçersiz hale getirilmeli
- Eski şifre ile aynı olmamalı (opsiyonel kontrol)

---

## Company Dashboard Endpoints

### 1. Get Dashboard Stats (Dashboard İstatistikleri)

**Endpoint:** `GET company/dashboard/stats`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Benzersiz kart ID'si (örn: 'active-jobs', 'applications', 'favorite-influencers')",
      "title": "string (required) - Kart başlığı (örn: 'Aktif İlanlarım')",
      "description": "string (required) - Kart açıklaması (örn: 'Oluşturduğum iş ilan sayısı')",
      "value": "number (required) - Gösterilecek sayısal değer",
      "icon": "string (required) - PrimeIcon class adı (örn: 'pi pi-briefcase', 'pi pi-file', 'pi pi-heart')",
      "color": "string (required) - Badge rengi hex formatında (örn: '#17A2B8', '#3498DB', '#E91E63')"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının şirketine ait dashboard istatistikleri dönmeli
- En az 3 kart dönmeli (Aktif İlanlarım, Gelen Başvurular, Favori Influencer)
- Her kart için:
  - `id`: Frontend'de translation key olarak kullanılır (örn: `dashboard.infoCards.active-jobs.title`)
  - `value`: Gerçek zamanlı sayısal değer olmalı
  - `icon`: PrimeIcons kütüphanesinden geçerli bir icon class adı
  - `color`: CSS'de kullanılabilir hex renk kodu

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "active-jobs",
      "title": "Aktif İlanlarım",
      "description": "Oluşturduğum iş ilan sayısı",
      "value": 12,
      "icon": "pi pi-briefcase",
      "color": "#17A2B8"
    },
    {
      "id": "applications",
      "title": "Gelen Başvurular",
      "description": "Gelen iş başvuru sayısı",
      "value": 12,
      "icon": "pi pi-file",
      "color": "#3498DB"
    },
    {
      "id": "favorite-influencers",
      "title": "Favori Influencer",
      "description": "Beğendiğim influencer sayısı",
      "value": 12,
      "icon": "pi pi-heart",
      "color": "#E91E63"
    }
  ],
  "message": null
}
```

---

### 2. Get Most Preferred (En Çok Tercih Edilenler)

**Endpoint:** `GET company/dashboard/mostPreferred`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Benzersiz ID",
      "name": "string (required) - Kişi adı",
      "status": "string (required) - Kişi pozisyonu/unvanı (örn: 'Marketing Manager', 'Graphic Designer')"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının şirketine ait en çok tercih edilen kişiler listesi dönmeli
- Liste genellikle en çok çalışılan veya en çok tercih edilen kişileri içermeli
- Boş liste durumunda boş array dönmeli

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Angela Moss",
      "status": "Marketing Manager"
    },
    {
      "id": "2",
      "name": "Andy Law",
      "status": "Graphic Designer"
    },
    {
      "id": "3",
      "name": "Benny Kenn",
      "status": "Software Engineer"
    },
    {
      "id": "4",
      "name": "Chynthia Lawra",
      "status": "CEO"
    }
  ],
  "message": null
}
```

---

### 3. Get Profile (Profil Bilgileri)

**Endpoint:** `GET company/profile`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string (required) - Profil ID'si",
    "companyName": "string (required) - Firma adı",
    "aboutCompany": "string (optional) - Firma hakkında bilgisi",
    "city": "string (required) - İl",
    "district": "string (required) - İlçe",
    "address": "string (required) - Adres bilgisi",
    "sector": "string (required) - Sektör",
    "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
    "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)"
  },
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi profil bilgileri dönmeli
- Eğer profil henüz oluşturulmamışsa, boş değerlerle veya varsayılan değerlerle dönmeli
- `createDate` zorunludur ve ISO 8601 formatında olmalı
- `updateDate` opsiyoneldir, güncelleme yapılmadıysa null olabilir

**Örnek Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "companyName": "Soiree Konak",
    "aboutCompany": "İzmir'in en güzel kafe ve restoranı",
    "city": "izmir",
    "district": "konak",
    "address": "Akdeniz, Atatürk Cd. No:19 D:L, 35250 Konak/İzmir",
    "sector": "restaurant",
    "createDate": "2025-01-10T10:00:00.000Z",
    "updateDate": "2025-01-15T14:30:00.000Z"
  },
  "message": null
}
```

---

### 4. Update Profile (Profil Güncelleme - POST)

**Endpoint:** `POST company/profile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: application/json
```

**Request Body:**
```json
{
  "companyName": "string (required) - Firma adı",
  "aboutCompany": "string (optional) - Firma hakkında bilgisi",
  "city": "string (required) - İl",
  "district": "string (required) - İlçe",
  "address": "string (required) - Adres bilgisi",
  "sector": "string (required) - Sektör"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Profil başarıyla güncellendi)",
  "data": {
    "id": "string - Güncellenen profil ID'si",
    "companyName": "string - Firma adı"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Eksik alan', 'Geçersiz veri', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi profilini güncelleyebilme yetkisi olmalı
- Eğer profil yoksa oluşturulur, varsa güncellenir
- Tüm alanlar zorunludur (aboutCompany hariç)
- `aboutCompany` opsiyoneldir
- Başarılı güncelleme sonrası güncellenmiş profil bilgisi döner

**Örnek Request:**
```json
POST company/profile
{
  "companyName": "Soiree Konak",
  "aboutCompany": "İzmir'in en güzel kafe ve restoranı",
  "city": "izmir",
  "district": "konak",
  "address": "Akdeniz, Atatürk Cd. No:19 D:L, 35250 Konak/İzmir",
  "sector": "restaurant"
}
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Profil başarıyla güncellendi",
  "data": {
    "id": "123",
    "companyName": "Soiree Konak"
  }
}
```

---

### 5. Update Profile by ID (Profil Güncelleme - PUT)

**Endpoint:** `PUT company/profile/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: application/json
```

**URL Parameters:**
- `id`: string (required) - Güncellenecek profil ID'si

**Request Body:**
```json
{
  "companyName": "string (required) - Firma adı",
  "aboutCompany": "string (optional) - Firma hakkında bilgisi",
  "city": "string (required) - İl",
  "district": "string (required) - İlçe",
  "address": "string (required) - Adres bilgisi",
  "sector": "string (required) - Sektör"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Profil başarıyla güncellendi)",
  "data": {
    "id": "string - Güncellenen profil ID'si",
    "companyName": "string - Firma adı"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Eksik alan', 'Geçersiz veri', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Profil bulunamadı')"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi profilini güncelleyebilme yetkisi olmalı
- Profil ID'si geçerli olmalı ve kullanıcının erişim yetkisi olmalı
- Tüm alanlar zorunludur (aboutCompany hariç)
- `aboutCompany` opsiyoneldir
- Başarılı güncelleme sonrası güncellenmiş profil bilgisi döner

**Örnek Request:**
```json
PUT company/profile/123
{
  "companyName": "Güncellenmiş Soiree Konak",
  "aboutCompany": "Güncellenmiş firma açıklaması",
  "city": "izmir",
  "district": "karsiyaka",
  "address": "Yeni Adres No:456",
  "sector": "restaurant"
}
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Profil başarıyla güncellendi",
  "data": {
    "id": "123",
    "companyName": "Güncellenmiş Soiree Konak"
  }
}
```

---

### 6. Get Profile Info (Profil İstatistikleri)

**Endpoint:** `GET company/profileInfo`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "activeAds": "number (optional) - Aktif ilan sayısı",
    "totalApplications": "number (optional) - Toplam başvuru sayısı",
    "favoriteInfluencers": "number (optional) - Favori influencer sayısı",
    "totalJobs": "number (required) - Toplam iş sayısı",
    "completedJobs": "number (required) - Tamamlanan iş sayısı",
    "pendingJobs": "number (required) - Bekleyen iş sayısı",
    "cancelledJobs": "number (required) - İptal olan iş sayısı"
  },
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi şirket profil istatistiklerine erişim yetkisi olmalı
- `totalJobs`, `completedJobs`, `pendingJobs`, `cancelledJobs` alanları zorunludur
- `activeAds`, `totalApplications`, `favoriteInfluencers` alanları opsiyoneldir
- İstatistikler gerçek zamanlı olarak hesaplanmalı

**Örnek Response:**
```json
{
  "success": true,
  "data": {
    "activeAds": 15,
    "totalApplications": 42,
    "favoriteInfluencers": 8,
    "totalJobs": 50,
    "completedJobs": 35,
    "pendingJobs": 10,
    "cancelledJobs": 5
  },
  "message": null
}
```

---

## Applications Endpoints

### Application Status Enum

Başvuru durumu için kullanılan enum değerleri:

```typescript
enum ApplicationStatus {
  PENDING = 1,      // Bekliyor
  APPROVED = 2,     // Onaylandı
  REJECTED = 3,     // Reddedildi
}
```

**Değerler:**
- `1` - Bekliyor
- `2` - Onaylandı
- `3` - Reddedildi

---

### 1. Get Applications (Başvuru Listesi)

**Endpoint:** `GET applications`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Query Parameters (Opsiyonel):**
- `page`: number - Sayfa numarası (varsayılan: 1)
- `pageSize`: number - Sayfa başına kayıt sayısı (varsayılan: tümü)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Benzersiz başvuru ID'si",
      "adType": "string (required) - İlan tipi ('soiree-menu' | 'beach-cocktail' | 'soiree-breakfast')",
      "profileImageSrc": "string (optional) - Profil resmi URL'i",
      "fullName": "string (required) - Başvuran kişinin tam adı",
      "followerCount": "string (required) - Takipçi sayısı (örn: '13.5K')",
      "location": "string (required) - Konum bilgisi",
      "socialMedia": {
        "instagram": "boolean (optional) - Instagram hesabı var mı",
        "tiktok": "boolean (optional) - TikTok hesabı var mı",
        "youtube": "boolean (optional) - YouTube hesabı var mı"
      },
      "status": "number (required) - Başvuru durumu (1: Bekliyor, 2: Onaylandı, 3: Reddedildi)"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının şirketine ait başvurular dönmeli
- Başvurular en yeni tarihli olandan en eskiye doğru sıralanmalı
- `status` alanı zorunludur ve ApplicationStatus enum değerlerinden biri olmalıdır (1, 2, veya 3)
- `adType` değerleri: "soiree-menu", "beach-cocktail", "soiree-breakfast"
- `followerCount` formatı: String olarak gösterilir (örn: "13.5K", "1.2M")
- `socialMedia` objesi içindeki tüm alanlar opsiyoneldir
- Boş liste durumunda boş array dönmeli
- **Pagination:**
  - `page` parametresi gönderilirse, belirtilen sayfa döner
  - `pageSize` parametresi gönderilirse, sayfa başına belirtilen sayıda kayıt döner
  - Her iki parametre de gönderilirse, pagination uygulanır
  - Örnek: `GET applications?page=1&pageSize=4` → İlk sayfadan 4 kayıt döner

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "adType": "soiree-menu",
      "profileImageSrc": "https://example.com/profile.jpg",
      "fullName": "Derya Sevin",
      "followerCount": "13.5K",
      "location": "İzmir",
      "socialMedia": {
        "instagram": true,
        "tiktok": true,
        "youtube": true
      },
      "status": 1
    },
    {
      "id": "2",
      "adType": "soiree-menu",
      "fullName": "Derya Sevin",
      "followerCount": "13.5K",
      "location": "İzmir",
      "socialMedia": {
        "instagram": true,
        "tiktok": true,
        "youtube": true
      },
      "status": 2
    },
    {
      "id": "3",
      "adType": "beach-cocktail",
      "fullName": "Derya Sevin",
      "followerCount": "13.5K",
      "location": "İzmir",
      "socialMedia": {
        "instagram": true,
        "tiktok": false,
        "youtube": true
      },
      "status": 3
    }
  ],
  "message": null
}
```

---

### 2. Update Application Status (Başvuru Durumu Güncelleme)

**Endpoint:** `PUT applications/:id`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**URL Parameters:**
- `id`: string (required) - Güncellenecek başvurunun ID'si

**Request Body:**
```json
{
  "status": "number (required) - Yeni durum (1: Bekliyor, 2: Onaylandı, 3: Reddedildi)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Başvuru durumu başarıyla güncellendi)",
  "data": {
    "id": "string - Güncellenen başvurunun ID'si",
    "status": "number - Yeni durum (1, 2, veya 3)"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Geçersiz durum değeri', 'Başvuru bulunamadı', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Başvuru bulunamadı')"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının şirketine ait başvuruları güncelleyebilme yetkisi olmalı
- `status` değeri ApplicationStatus enum değerlerinden biri olmalıdır (1, 2, veya 3)
- Status değerleri:
  - `1` - Bekliyor (PENDING)
  - `2` - Onaylandı (APPROVED)
  - `3` - Reddedildi (REJECTED)
- Başvuru ID'si geçerli olmalı ve kullanıcının erişim yetkisi olmalı
- Başarılı güncelleme sonrası güncellenmiş başvuru bilgisi dönebilir

**Örnek Request:**
```json
PUT applications/123
{
  "status": 2
}
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Başvuru durumu başarıyla onaylandı",
  "data": {
    "id": "123",
    "status": 2
  }
}
```

---

### 3. Get Dashboard Applications (Dashboard Başvuru Listesi)

**Endpoint:** `GET company/dashboard/applications`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Benzersiz başvuru ID'si",
      "email": "string (required) - Başvuran kişinin email adresi",
      "title": "string (required) - İlan başlığı",
      "description": "string (required) - İlan açıklaması",
      "timeAgo": "string (required) - Başvuru zamanı (örn: '24 dk önce', '1 saat önce', '2 saat önce')"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının şirketine ait son gelen başvurular dönmeli (dashboard için basit format)
- Başvurular en yeni tarihli olandan en eskiye doğru sıralanmalı
- `timeAgo` formatı: Türkçe format kullanılmalı (örn: "24 dk önce", "1 saat önce", "2 saat önce", "3 gün önce")
- Boş liste durumunda boş array dönmeli
- Bu endpoint dashboard için basit bir liste döndürür (email, title, description, timeAgo)
- Detaylı başvuru bilgileri için `applications` endpoint'i kullanılmalı

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "email": "avtyazilim@mail.com",
      "title": "Cafe Tanıtım / Influencer Arayışı",
      "description": "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
      "timeAgo": "24 dk önce"
    },
    {
      "id": "2",
      "email": "avtyazilim@mail.com",
      "title": "Cafe Tanıtım / Influencer Arayışı",
      "description": "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
      "timeAgo": "32 dk önce"
    },
    {
      "id": "3",
      "email": "avtyazilim@mail.com",
      "title": "Cafe Tanıtım / Influencer Arayışı",
      "description": "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz. Sosyal medya takipçi sayısı en az 10K olmalıdır.",
      "timeAgo": "45 dk önce"
    }
  ],
  "message": null
}
```

---

### 4. Create Evaluation (Değerlendirme Oluşturma)

**Endpoint:** `POST applications/Evaluation`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: application/json
```

**Request Body:**
```json
{
  "applicationId": "string (required) - Başvuru ID'si",
  "influencerId": "string (required) - Influencer ID'si",
  "serviceSatisfaction": "number (required) - Hizmet memnuniyeti (1-5 arası)",
  "collaborationEffectiveness": "number (required) - İş birliği etkinliği (1-5 arası)",
  "agreementAdherence": "string (required) - Anlaşmaya uyum ('yes' veya 'no')",
  "agreementExplanation": "string (optional) - Anlaşmaya uyulmadıysa açıklama (agreementAdherence='no' ise zorunlu)",
  "effects": {
    "followerIncrease": "boolean (required) - Takipçi sayısı arttı mı",
    "similarCollaborations": "boolean (required) - Benzer iş birlikleri alındı mı",
    "likeIncrease": "boolean (required) - Beğeni sayısı arttı mı",
    "viewIncrease": "boolean (required) - İzlenme sayısı arttı mı"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Değerlendirme başarıyla oluşturuldu)",
  "data": {
    "id": "string - Oluşturulan değerlendirmenin ID'si",
    "applicationId": "string - Başvuru ID'si",
    "influencerId": "string - Influencer ID'si"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Eksik alan', 'Geçersiz değer', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi başvurularını değerlendirme yetkisi olmalı
- `serviceSatisfaction` ve `collaborationEffectiveness` 1-5 arası değer olmalıdır
- `agreementAdherence` sadece "yes" veya "no" değerlerini alabilir
- `agreementAdherence` "no" ise `agreementExplanation` zorunludur
- `effects` objesi içindeki tüm alanlar boolean olmalıdır
- Aynı `applicationId` ve `influencerId` kombinasyonu için birden fazla değerlendirme oluşturulabilir (veya backend tarafında unique constraint uygulanabilir)

**Örnek Request:**
```json
POST applications/Evaluation
{
  "applicationId": "app-123",
  "influencerId": "inf-456",
  "serviceSatisfaction": 4,
  "collaborationEffectiveness": 5,
  "agreementAdherence": "yes",
  "effects": {
    "followerIncrease": true,
    "similarCollaborations": false,
    "likeIncrease": true,
    "viewIncrease": true
  }
}
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Değerlendirme başarıyla oluşturuldu",
  "data": {
    "id": "eval-789",
    "applicationId": "app-123",
    "influencerId": "inf-456"
  }
}
```

---

### 5. Get Evaluation (Değerlendirme Getirme)

**Endpoint:** `GET applications/Evaluation/:id`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**URL Parameters:**
- `id`: string (required) - Getirilecek değerlendirmenin ID'si

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string (required) - Değerlendirme ID'si",
    "applicationId": "string (required) - Başvuru ID'si",
    "influencerId": "string (required) - Influencer ID'si",
    "serviceSatisfaction": "number (required) - Hizmet memnuniyeti (1-5)",
    "collaborationEffectiveness": "number (required) - İş birliği etkinliği (1-5)",
    "agreementAdherence": "string (required) - Anlaşmaya uyum ('yes' veya 'no')",
    "agreementExplanation": "string (optional) - Anlaşmaya uyulmadıysa açıklama",
    "effects": {
      "followerIncrease": "boolean (required) - Takipçi sayısı arttı mı",
      "similarCollaborations": "boolean (required) - Benzer iş birlikleri alındı mı",
      "likeIncrease": "boolean (required) - Beğeni sayısı arttı mı",
      "viewIncrease": "boolean (required) - İzlenme sayısı arttı mı"
    },
    "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
    "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)"
  },
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Değerlendirme bulunamadı')"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi başvurularının değerlendirmelerine erişim yetkisi olmalı
- Değerlendirme ID'si geçerli olmalı
- `createDate` zorunludur ve ISO 8601 formatında olmalı
- `updateDate` opsiyoneldir, güncelleme yapılmadıysa null olabilir
- `agreementExplanation` sadece `agreementAdherence` "no" ise dolu olur

**Örnek Response:**
```json
{
  "success": true,
  "data": {
    "id": "eval-789",
    "applicationId": "app-123",
    "influencerId": "inf-456",
    "serviceSatisfaction": 4,
    "collaborationEffectiveness": 5,
    "agreementAdherence": "no",
    "agreementExplanation": "Influencer anlaşmada belirtilen içerik formatına uymadı.",
    "effects": {
      "followerIncrease": true,
      "similarCollaborations": false,
      "likeIncrease": true,
      "viewIncrease": true
    },
    "createDate": "2025-01-20T10:30:00.000Z",
    "updateDate": null
  },
  "message": null
}
```

---

## Advertisements Endpoints

### 1. Add Advertisement (İlan Ekleme)

**Endpoint:** `POST Advertisements/addAd`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: string (required) - İlan başlığı
description: string (required) - İlan açıklaması
startDate: string (required) - Başlangıç tarihi (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)
endDate: string (required) - Bitiş tarihi (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)
city: string (required) - İl
district: string (required) - İlçe
address: string (required) - Adres
sector: string (required) - Sektör
category: string (required) - Kategori
services: string (required) - Sunulan hizmetler/ikramlar
guestCount: string (required) - Misafir sayısı (örn: "1-2", "3-5", "6-10", "10+")
platformPreference: string (required) - Platform tercihi (örn: "instagram", "tiktok", "youtube", "twitter")
followerRange: string (required) - Takipçi aralığı (örn: "1k-10k", "10k-50k", "50k-100k", "100k+")
contentType: string (required) - İçerik türü (örn: "photo", "video", "reels", "story")
businessType: string (required) - İş tipi (örn: "part-time", "full-time", "project-based")
image: File (optional) - İlan görseli (JPG, PNG, maksimum 5MB)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (İlan başarıyla eklendi)",
  "data": {
    "id": "string - Oluşturulan ilanın ID'si",
    "title": "string - İlan başlığı",
    "imageUrl": "string (optional) - Yüklenen görselin URL'i"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Geçersiz tarih aralığı', 'Eksik alan', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Content-Type: `multipart/form-data` olmalı (dosya yükleme için)
- Tüm alanlar zorunludur (image hariç)
- `startDate` ve `endDate` ISO 8601 formatında olmalı
- `image` dosyası opsiyoneldir, maksimum 5MB olmalı
- Desteklenen görsel formatları: JPG, PNG
- Başarılı oluşturma sonrası oluşturulan ilan bilgisi döner

**Örnek Request:**
```
POST Advertisements/addAd
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Cafe Tanıtım / Influencer Arayışı"
description: "Cafemizi tanıtmak üzere bir influencer arıyoruz..."
startDate: "2025-01-15T00:00:00.000Z"
endDate: "2025-02-15T00:00:00.000Z"
city: "izmir"
district: "konak"
address: "Kordon Boyu No:123"
sector: "restaurant"
category: "restaurant-cafe"
services: "Kahvaltı ve kahve ikramı"
guestCount: "1-2"
platformPreference: "instagram"
followerRange: "10k-50k"
contentType: "photo"
businessType: "project-based"
image: [File]
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "İlan başarıyla eklendi",
  "data": {
    "id": "123",
    "title": "Cafe Tanıtım / Influencer Arayışı",
    "imageUrl": "https://example.com/images/ad-123.jpg"
  }
}
```

---

### 2. Update Advertisement (İlan Güncelleme)

**Endpoint:** `PUT Advertisements/addAd/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: multipart/form-data
```

**URL Parameters:**
- `id`: string (required) - Güncellenecek ilanın ID'si

**Request Body (FormData):**
```
title: string (required) - İlan başlığı
description: string (required) - İlan açıklaması
startDate: string (required) - Başlangıç tarihi (ISO 8601 format)
endDate: string (required) - Bitiş tarihi (ISO 8601 format)
city: string (required) - İl
district: string (required) - İlçe
address: string (required) - Adres
sector: string (required) - Sektör
category: string (required) - Kategori
services: string (required) - Sunulan hizmetler/ikramlar
guestCount: string (required) - Misafir sayısı
platformPreference: string (required) - Platform tercihi
followerRange: string (required) - Takipçi aralığı
contentType: string (required) - İçerik türü
businessType: string (required) - İş tipi
image: File (optional) - İlan görseli (yeni görsel yüklenirse)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (İlan başarıyla güncellendi)",
  "data": {
    "id": "string - Güncellenen ilanın ID'si",
    "title": "string - İlan başlığı",
    "imageUrl": "string (optional) - Güncellenmiş görselin URL'i"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Geçersiz tarih aralığı', 'Eksik alan', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'İlan bulunamadı')"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi ilanlarını güncelleyebilme yetkisi olmalı
- Content-Type: `multipart/form-data` olmalı
- Tüm alanlar zorunludur (image hariç)
- `image` gönderilmezse mevcut görsel korunur
- `image` gönderilirse yeni görsel yüklenir ve eski görsel değiştirilir
- İlan ID'si geçerli olmalı ve kullanıcının erişim yetkisi olmalı

**Örnek Request:**
```
PUT Advertisements/addAd/123
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Güncellenmiş Cafe Tanıtım"
description: "Güncellenmiş açıklama..."
startDate: "2025-01-20T00:00:00.000Z"
endDate: "2025-02-20T00:00:00.000Z"
city: "izmir"
district: "karsiyaka"
address: "Yeni Adres No:456"
sector: "restaurant"
category: "restaurant-cafe"
services: "Güncellenmiş hizmetler"
guestCount: "3-5"
platformPreference: "tiktok"
followerRange: "50k-100k"
contentType: "video"
businessType: "full-time"
image: [File] (optional)
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "İlan başarıyla güncellendi",
  "data": {
    "id": "123",
    "title": "Güncellenmiş Cafe Tanıtım",
    "imageUrl": "https://example.com/images/ad-123-updated.jpg"
  }
}
```

---

### 3. Get Advertisement (Tek İlan Getirme)

**Endpoint:** `GET Advertisements/addAd/:id`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**URL Parameters:**
- `id`: string (required) - Getirilecek ilanın ID'si

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string (required) - İlan ID'si",
    "title": "string (required) - İlan başlığı",
    "description": "string (required) - İlan açıklaması",
    "startDate": "string (required) - Başlangıç tarihi (ISO 8601 format)",
    "endDate": "string (required) - Bitiş tarihi (ISO 8601 format)",
    "city": "string (required) - İl",
    "district": "string (required) - İlçe",
    "address": "string (required) - Adres",
    "sector": "string (required) - Sektör",
    "category": "string (required) - Kategori",
    "services": "string (required) - Sunulan hizmetler/ikramlar",
    "guestCount": "string (required) - Misafir sayısı",
    "platformPreference": "string (required) - Platform tercihi",
    "followerRange": "string (required) - Takipçi aralığı",
    "contentType": "string (required) - İçerik türü",
    "businessType": "string (required) - İş tipi",
    "imageUrl": "string (optional) - İlan görseli URL'i",
    "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
    "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)",
    "status": "string (optional) - İlan durumu (örn: 'active', 'inactive', 'pending')"
  },
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'İlan bulunamadı')"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi ilanlarına erişim yetkisi olmalı
- Tüm POST'taki alanlar + ek alanlar (id, createDate, updateDate, status) dönmeli
- `createDate` zorunludur ve ISO 8601 formatında olmalı
- `updateDate` opsiyoneldir, güncelleme yapılmadıysa null olabilir
- `status` opsiyoneldir, ilanın aktif/pasif durumunu gösterir

**Örnek Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "Cafe Tanıtım / Influencer Arayışı",
    "description": "Cafemizi tanıtmak üzere bir influencer arıyoruz. Sabahtan gelip öğlene kadar kalarak kahvaltı ve akabinde kahve ikramı ile tanıtım yapılmasını istiyoruz.",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-02-15T00:00:00.000Z",
    "city": "izmir",
    "district": "konak",
    "address": "Kordon Boyu No:123",
    "sector": "restaurant",
    "category": "restaurant-cafe",
    "services": "Kahvaltı ve kahve ikramı",
    "guestCount": "1-2",
    "platformPreference": "instagram",
    "followerRange": "10k-50k",
    "contentType": "photo",
    "businessType": "project-based",
    "imageUrl": "https://example.com/images/ad-123.jpg",
    "createDate": "2025-01-10T10:30:00.000Z",
    "updateDate": "2025-01-12T14:20:00.000Z",
    "status": "active"
  },
  "message": null
}
```

---

### 4. Get Advertisements List (İlan Listesi)

**Endpoint:** `GET Advertisements/addAd`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Query Parameters (Opsiyonel):**
- `page`: number - Sayfa numarası (varsayılan: 1)
- `pageSize`: number - Sayfa başına kayıt sayısı (varsayılan: tümü)
- `searchTerm`: string - Arama terimi (başlık, açıklama, kategori vb. alanlarda arama yapar)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - İlan ID'si",
      "title": "string (required) - İlan başlığı",
      "description": "string (required) - İlan açıklaması",
      "startDate": "string (required) - Başlangıç tarihi (ISO 8601 format)",
      "endDate": "string (required) - Bitiş tarihi (ISO 8601 format)",
      "city": "string (required) - İl",
      "district": "string (required) - İlçe",
      "address": "string (required) - Adres",
      "sector": "string (required) - Sektör",
      "category": "string (required) - Kategori",
      "services": "string (required) - Sunulan hizmetler/ikramlar",
      "guestCount": "string (required) - Misafir sayısı",
      "platformPreference": "string (required) - Platform tercihi",
      "followerRange": "string (required) - Takipçi aralığı",
      "contentType": "string (required) - İçerik türü",
      "businessType": "string (required) - İş tipi",
      "imageUrl": "string (optional) - İlan görseli URL'i",
      "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
      "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)",
      "status": "string (optional) - İlan durumu"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi ilanlarının listesi dönmeli
- İlanlar en yeni tarihli olandan en eskiye doğru sıralanmalı
- Boş liste durumunda boş array dönmeli
- Her ilan için tüm alanlar (POST'taki alanlar + id, createDate, updateDate, status) dönmeli
- **Pagination:**
  - `page` parametresi gönderilirse, belirtilen sayfa döner
  - `pageSize` parametresi gönderilirse, sayfa başına belirtilen sayıda kayıt döner
  - Her iki parametre de gönderilirse, pagination uygulanır
  - Örnek: `GET Advertisements/addAd?page=1&pageSize=10` → İlk sayfadan 10 kayıt döner
- **Search:**
  - `searchTerm` parametresi gönderilirse, başlık, açıklama, kategori, şehir, ilçe gibi alanlarda arama yapılır
  - Arama case-insensitive (büyük/küçük harf duyarsız) olmalı
  - Boş string gönderilirse arama yapılmaz
  - Örnek: `GET Advertisements/addAd?searchTerm=cafe` → "cafe" içeren ilanlar döner
- **Kullanım:**
  - Bu endpoint ad-management sayfasında "İlanlar" tab'ında kullanılır
  - Dönen veriler takvim görünümünde gösterilir

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "title": "Cafe Tanıtım / Influencer Arayışı",
      "description": "Cafemizi tanıtmak üzere bir influencer arıyoruz...",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-02-15T00:00:00.000Z",
      "city": "izmir",
      "district": "konak",
      "address": "Kordon Boyu No:123",
      "sector": "restaurant",
      "category": "restaurant-cafe",
      "services": "Kahvaltı ve kahve ikramı",
      "guestCount": "1-2",
      "platformPreference": "instagram",
      "followerRange": "10k-50k",
      "contentType": "photo",
      "businessType": "project-based",
      "imageUrl": "https://example.com/images/ad-123.jpg",
      "createDate": "2025-01-10T10:30:00.000Z",
      "updateDate": null,
      "status": "active"
    },
    {
      "id": "124",
      "title": "Beach Etkinliği / Influencer Arayışı",
      "description": "Beach etkinliğimiz için influencer arıyoruz...",
      "startDate": "2025-02-01T00:00:00.000Z",
      "endDate": "2025-02-28T00:00:00.000Z",
      "city": "antalya",
      "district": "konyaalti",
      "address": "Beach Caddesi No:456",
      "sector": "restaurant",
      "category": "beach",
      "services": "Kokteyl ve yemek ikramı",
      "guestCount": "3-5",
      "platformPreference": "tiktok",
      "followerRange": "50k-100k",
      "contentType": "video",
      "businessType": "full-time",
      "imageUrl": "https://example.com/images/ad-124.jpg",
      "createDate": "2025-01-08T08:15:00.000Z",
      "updateDate": "2025-01-09T12:00:00.000Z",
      "status": "active"
    }
  ],
  "message": null
}
```

---

## Workshops Endpoints

### 1. Add Workshop (Workshop Ekleme)

**Endpoint:** `POST Advertisements/addWorkshop`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: string (required) - Workshop başlığı
description: string (required) - Workshop açıklaması
startDate: string (required) - Başlangıç tarihi (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)
endDate: string (required) - Bitiş tarihi (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)
duration: string (required) - Süre (örn: "1", "2", "3", "4", "half-day", "full-day")
city: string (required) - İl
district: string (required) - İlçe
address: string (required) - Adres
category: string (required) - Kategori (örn: "restaurant-cafe", "art", "music", "food-drink", "technology", "personal-development")
targetAudience: string (required) - Hedef kitle (örn: "adults", "teens", "children", "everyone", "professionals")
participantCount: string (required) - Katılımcı sayısı (örn: "5-10", "10-15", "15-20", "20-30", "30+")
participationCondition: string (required) - Katılım şartı (örn: "registration-required", "paid", "free", "preregistration-required")
fee: string (required) - Ücret bilgisi (boş olabilir)
contentType: string (required) - İçerik türü (örn: "photo", "video", "reels", "story")
workshopGoal: string (required) - Workshop hedefi
workshopContent: string (required) - Workshop içeriği
image: File (optional) - Workshop görseli (JPG, PNG, maksimum 5MB)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Workshop başarıyla eklendi)",
  "data": {
    "id": "string - Oluşturulan workshop'un ID'si",
    "title": "string - Workshop başlığı",
    "imageUrl": "string (optional) - Yüklenen görselin URL'i"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Geçersiz tarih aralığı', 'Eksik alan', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Content-Type: `multipart/form-data` olmalı (dosya yükleme için)
- Tüm alanlar zorunludur (image hariç)
- `startDate` ve `endDate` ISO 8601 formatında olmalı
- `image` dosyası opsiyoneldir, maksimum 5MB olmalı
- Desteklenen görsel formatları: JPG, PNG
- `fee` alanı boş string olabilir (ücretsiz workshop için)
- Başarılı oluşturma sonrası oluşturulan workshop bilgisi döner

**Örnek Request:**
```
POST Advertisements/addWorkshop
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Fotoğrafçılık Workshop'u"
description: "Temel fotoğrafçılık tekniklerini öğreneceğiniz bir workshop..."
startDate: "2025-02-01T10:00:00.000Z"
endDate: "2025-02-01T14:00:00.000Z"
duration: "half-day"
city: "izmir"
district: "konak"
address: "Sanat Merkezi No:123"
category: "art"
targetAudience: "adults"
participantCount: "10-15"
participationCondition: "paid"
fee: "500"
contentType: "photo"
workshopGoal: "Katılımcıların temel fotoğrafçılık tekniklerini öğrenmesi"
workshopContent: "Workshop süreci, kullanılacak ekipmanlar, uygulamalı çalışmalar"
image: [File]
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Workshop başarıyla eklendi",
  "data": {
    "id": "456",
    "title": "Fotoğrafçılık Workshop'u",
    "imageUrl": "https://example.com/images/workshop-456.jpg"
  }
}
```

---

### 2. Update Workshop (Workshop Güncelleme)

**Endpoint:** `PUT Advertisements/addWorkshop/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: multipart/form-data
```

**URL Parameters:**
- `id`: string (required) - Güncellenecek workshop'un ID'si

**Request Body (FormData):**
```
title: string (required) - Workshop başlığı
description: string (required) - Workshop açıklaması
startDate: string (required) - Başlangıç tarihi (ISO 8601 format)
endDate: string (required) - Bitiş tarihi (ISO 8601 format)
duration: string (required) - Süre
city: string (required) - İl
district: string (required) - İlçe
address: string (required) - Adres
category: string (required) - Kategori
targetAudience: string (required) - Hedef kitle
participantCount: string (required) - Katılımcı sayısı
participationCondition: string (required) - Katılım şartı
fee: string (required) - Ücret bilgisi
contentType: string (required) - İçerik türü
workshopGoal: string (required) - Workshop hedefi
workshopContent: string (required) - Workshop içeriği
image: File (optional) - Workshop görseli (yeni görsel yüklenirse)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Workshop başarıyla güncellendi)",
  "data": {
    "id": "string - Güncellenen workshop'un ID'si",
    "title": "string - Workshop başlığı",
    "imageUrl": "string (optional) - Güncellenmiş görselin URL'i"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Geçersiz tarih aralığı', 'Eksik alan', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Workshop bulunamadı')"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi workshop'larını güncelleyebilme yetkisi olmalı
- Content-Type: `multipart/form-data` olmalı
- Tüm alanlar zorunludur (image hariç)
- `image` gönderilmezse mevcut görsel korunur
- `image` gönderilirse yeni görsel yüklenir ve eski görsel değiştirilir
- Workshop ID'si geçerli olmalı ve kullanıcının erişim yetkisi olmalı

**Örnek Request:**
```
PUT Advertisements/addWorkshop/456
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Güncellenmiş Fotoğrafçılık Workshop'u"
description: "Güncellenmiş açıklama..."
startDate: "2025-02-05T10:00:00.000Z"
endDate: "2025-02-05T15:00:00.000Z"
duration: "full-day"
city: "izmir"
district: "karsiyaka"
address: "Yeni Adres No:456"
category: "art"
targetAudience: "professionals"
participantCount: "15-20"
participationCondition: "registration-required"
fee: "750"
contentType: "video"
workshopGoal: "Güncellenmiş hedef"
workshopContent: "Güncellenmiş içerik"
image: [File] (optional)
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Workshop başarıyla güncellendi",
  "data": {
    "id": "456",
    "title": "Güncellenmiş Fotoğrafçılık Workshop'u",
    "imageUrl": "https://example.com/images/workshop-456-updated.jpg"
  }
}
```

---

### 3. Get Workshop (Tek Workshop Getirme)

**Endpoint:** `GET Advertisements/addWorkshop/:id`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**URL Parameters:**
- `id`: string (required) - Getirilecek workshop'un ID'si

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string (required) - Workshop ID'si",
    "title": "string (required) - Workshop başlığı",
    "description": "string (required) - Workshop açıklaması",
    "startDate": "string (required) - Başlangıç tarihi (ISO 8601 format)",
    "endDate": "string (required) - Bitiş tarihi (ISO 8601 format)",
    "duration": "string (required) - Süre",
    "city": "string (required) - İl",
    "district": "string (required) - İlçe",
    "address": "string (required) - Adres",
    "category": "string (required) - Kategori",
    "targetAudience": "string (required) - Hedef kitle",
    "participantCount": "string (required) - Katılımcı sayısı",
    "participationCondition": "string (required) - Katılım şartı",
    "fee": "string (required) - Ücret bilgisi",
    "contentType": "string (required) - İçerik türü",
    "workshopGoal": "string (required) - Workshop hedefi",
    "workshopContent": "string (required) - Workshop içeriği",
    "imageUrl": "string (optional) - Workshop görseli URL'i",
    "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
    "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)",
    "status": "string (optional) - Workshop durumu (örn: 'active', 'inactive', 'pending')"
  },
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Workshop bulunamadı')"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi workshop'larına erişim yetkisi olmalı
- Tüm POST'taki alanlar + ek alanlar (id, createDate, updateDate, status) dönmeli
- `createDate` zorunludur ve ISO 8601 formatında olmalı
- `updateDate` opsiyoneldir, güncelleme yapılmadıysa null olabilir
- `status` opsiyoneldir, workshop'un aktif/pasif durumunu gösterir

**Örnek Response:**
```json
{
  "success": true,
  "data": {
    "id": "456",
    "title": "Fotoğrafçılık Workshop'u",
    "description": "Temel fotoğrafçılık tekniklerini öğreneceğiniz bir workshop. Uygulamalı çalışmalar ve teorik bilgiler içerir.",
    "startDate": "2025-02-01T10:00:00.000Z",
    "endDate": "2025-02-01T14:00:00.000Z",
    "duration": "half-day",
    "city": "izmir",
    "district": "konak",
    "address": "Sanat Merkezi No:123",
    "category": "art",
    "targetAudience": "adults",
    "participantCount": "10-15",
    "participationCondition": "paid",
    "fee": "500",
    "contentType": "photo",
    "workshopGoal": "Katılımcıların temel fotoğrafçılık tekniklerini öğrenmesi",
    "workshopContent": "Workshop süreci, kullanılacak ekipmanlar, uygulamalı çalışmalar",
    "imageUrl": "https://example.com/images/workshop-456.jpg",
    "createDate": "2025-01-15T09:00:00.000Z",
    "updateDate": "2025-01-20T11:30:00.000Z",
    "status": "active"
  },
  "message": null
}
```

---

### 4. Get Workshops List (Workshop Listesi)

**Endpoint:** `GET Advertisements/addWorkshop`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Query Parameters (Opsiyonel):**
- `page`: number - Sayfa numarası (varsayılan: 1)
- `pageSize`: number - Sayfa başına kayıt sayısı (varsayılan: tümü)
- `searchTerm`: string - Arama terimi (başlık, açıklama, kategori vb. alanlarda arama yapar)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Workshop ID'si",
      "title": "string (required) - Workshop başlığı",
      "description": "string (required) - Workshop açıklaması",
      "startDate": "string (required) - Başlangıç tarihi (ISO 8601 format)",
      "endDate": "string (required) - Bitiş tarihi (ISO 8601 format)",
      "duration": "string (required) - Süre",
      "city": "string (required) - İl",
      "district": "string (required) - İlçe",
      "address": "string (required) - Adres",
      "category": "string (required) - Kategori",
      "targetAudience": "string (required) - Hedef kitle",
      "participantCount": "string (required) - Katılımcı sayısı",
      "participationCondition": "string (required) - Katılım şartı",
      "fee": "string (required) - Ücret bilgisi",
      "contentType": "string (required) - İçerik türü",
      "workshopGoal": "string (required) - Workshop hedefi",
      "workshopContent": "string (required) - Workshop içeriği",
      "imageUrl": "string (optional) - Workshop görseli URL'i",
      "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
      "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)",
      "status": "string (optional) - Workshop durumu"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi workshop'larının listesi dönmeli
- Workshop'lar en yeni tarihli olandan en eskiye doğru sıralanmalı
- Boş liste durumunda boş array dönmeli
- Her workshop için tüm alanlar (POST'taki alanlar + id, createDate, updateDate, status) dönmeli
- **Pagination:**
  - `page` parametresi gönderilirse, belirtilen sayfa döner
  - `pageSize` parametresi gönderilirse, sayfa başına belirtilen sayıda kayıt döner
  - Her iki parametre de gönderilirse, pagination uygulanır
  - Örnek: `GET Advertisements/addWorkshop?page=1&pageSize=10` → İlk sayfadan 10 kayıt döner
- **Search:**
  - `searchTerm` parametresi gönderilirse, başlık, açıklama, kategori, şehir, ilçe gibi alanlarda arama yapılır
  - Arama case-insensitive (büyük/küçük harf duyarsız) olmalı
  - Boş string gönderilirse arama yapılmaz
  - Örnek: `GET Advertisements/addWorkshop?searchTerm=fotoğraf` → "fotoğraf" içeren workshop'lar döner
- **Kullanım:**
  - Bu endpoint ad-management sayfasında "Workshoplar" tab'ında kullanılır
  - Dönen veriler takvim görünümünde gösterilir

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "456",
      "title": "Fotoğrafçılık Workshop'u",
      "description": "Temel fotoğrafçılık tekniklerini öğreneceğiniz bir workshop...",
      "startDate": "2025-02-01T10:00:00.000Z",
      "endDate": "2025-02-01T14:00:00.000Z",
      "duration": "half-day",
      "city": "izmir",
      "district": "konak",
      "address": "Sanat Merkezi No:123",
      "category": "art",
      "targetAudience": "adults",
      "participantCount": "10-15",
      "participationCondition": "paid",
      "fee": "500",
      "contentType": "photo",
      "workshopGoal": "Katılımcıların temel fotoğrafçılık tekniklerini öğrenmesi",
      "workshopContent": "Workshop süreci, kullanılacak ekipmanlar, uygulamalı çalışmalar",
      "imageUrl": "https://example.com/images/workshop-456.jpg",
      "createDate": "2025-01-15T09:00:00.000Z",
      "updateDate": null,
      "status": "active"
    },
    {
      "id": "457",
      "title": "Müzik Workshop'u",
      "description": "Gitar çalmayı öğreneceğiniz bir workshop...",
      "startDate": "2025-02-10T14:00:00.000Z",
      "endDate": "2025-02-10T18:00:00.000Z",
      "duration": "half-day",
      "city": "istanbul",
      "district": "kadikoy",
      "address": "Müzik Akademisi No:789",
      "category": "music",
      "targetAudience": "everyone",
      "participantCount": "15-20",
      "participationCondition": "free",
      "fee": "",
      "contentType": "video",
      "workshopGoal": "Temel gitar tekniklerini öğrenmek",
      "workshopContent": "Akorlar, ritim, temel şarkılar",
      "imageUrl": "https://example.com/images/workshop-457.jpg",
      "createDate": "2025-01-12T08:00:00.000Z",
      "updateDate": "2025-01-18T15:00:00.000Z",
      "status": "active"
    }
  ],
  "message": null
}
```

---

## Gift Kits Endpoints

### 1. Add Gift Kit (Hediye Kiti Ekleme)

**Endpoint:** `POST Advertisements/addGiftKit`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: string (required) - Hediye kiti başlığı
content: string (required) - Hediye kiti içerik bilgisi
category: string (required) - Kategori (örn: "restaurant-cafe", "food-drink", "art", "music", "fashion", "technology")
targetAudience: string (required) - Hedef kitle (örn: "adults", "teens", "children", "everyone", "professionals")
followerRange: string (required) - Takipçi aralığı (örn: "1k-10k", "10k-50k", "50k-100k", "100k+")
platformPreference: string (required) - Platform tercihi (örn: "instagram", "tiktok", "youtube", "twitter")
businessType: string (required) - İş tipi (örn: "part-time", "full-time", "project-based")
contentType: string (required) - İçerik türü (örn: "photo", "video", "reels", "story")
image: File (optional) - Hediye kiti görseli (JPG, PNG, maksimum 5MB)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Hediye kiti başarıyla eklendi)",
  "data": {
    "id": "string - Oluşturulan hediye kitinin ID'si",
    "title": "string - Hediye kiti başlığı",
    "imageUrl": "string (optional) - Yüklenen görselin URL'i"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Eksik alan', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Content-Type: `multipart/form-data` olmalı (dosya yükleme için)
- Tüm alanlar zorunludur (image hariç)
- `image` dosyası opsiyoneldir, maksimum 5MB olmalı
- Desteklenen görsel formatları: JPG, PNG
- Başarılı oluşturma sonrası oluşturulan hediye kiti bilgisi döner

**Örnek Request:**
```
POST Advertisements/addGiftKit
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Yaz Koleksiyonu Hediye Kiti"
content: "Yaz sezonu için özel hazırlanmış hediye kiti. İçerisinde güneş kremi, şapka, plaj havlusu ve daha fazlası bulunmaktadır."
category: "fashion"
targetAudience: "adults"
followerRange: "10k-50k"
platformPreference: "instagram"
businessType: "project-based"
contentType: "photo"
image: [File]
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Hediye kiti başarıyla eklendi",
  "data": {
    "id": "789",
    "title": "Yaz Koleksiyonu Hediye Kiti",
    "imageUrl": "https://example.com/images/gift-kit-789.jpg"
  }
}
```

---

### 2. Update Gift Kit (Hediye Kiti Güncelleme)

**Endpoint:** `PUT Advertisements/addGiftKit/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: multipart/form-data
```

**URL Parameters:**
- `id`: string (required) - Güncellenecek hediye kitinin ID'si

**Request Body (FormData):**
```
title: string (required) - Hediye kiti başlığı
content: string (required) - Hediye kiti içerik bilgisi
category: string (required) - Kategori
targetAudience: string (required) - Hedef kitle
followerRange: string (required) - Takipçi aralığı
platformPreference: string (required) - Platform tercihi
businessType: string (required) - İş tipi
contentType: string (required) - İçerik türü
image: File (optional) - Hediye kiti görseli (yeni görsel yüklenirse)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Hediye kiti başarıyla güncellendi)",
  "data": {
    "id": "string - Güncellenen hediye kitinin ID'si",
    "title": "string - Hediye kiti başlığı",
    "imageUrl": "string (optional) - Güncellenmiş görselin URL'i"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Eksik alan', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Hediye kiti bulunamadı')"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi hediye kitlerini güncelleyebilme yetkisi olmalı
- Content-Type: `multipart/form-data` olmalı
- Tüm alanlar zorunludur (image hariç)
- `image` gönderilmezse mevcut görsel korunur
- `image` gönderilirse yeni görsel yüklenir ve eski görsel değiştirilir
- Hediye kiti ID'si geçerli olmalı ve kullanıcının erişim yetkisi olmalı

**Örnek Request:**
```
PUT Advertisements/addGiftKit/789
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Güncellenmiş Yaz Koleksiyonu Hediye Kiti"
content: "Güncellenmiş içerik bilgisi..."
category: "fashion"
targetAudience: "everyone"
followerRange: "50k-100k"
platformPreference: "tiktok"
businessType: "full-time"
contentType: "video"
image: [File] (optional)
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Hediye kiti başarıyla güncellendi",
  "data": {
    "id": "789",
    "title": "Güncellenmiş Yaz Koleksiyonu Hediye Kiti",
    "imageUrl": "https://example.com/images/gift-kit-789-updated.jpg"
  }
}
```

---

### 3. Get Gift Kit (Tek Hediye Kiti Getirme)

**Endpoint:** `GET Advertisements/addGiftKit/:id`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**URL Parameters:**
- `id`: string (required) - Getirilecek hediye kitinin ID'si

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string (required) - Hediye kiti ID'si",
    "title": "string (required) - Hediye kiti başlığı",
    "content": "string (required) - Hediye kiti içerik bilgisi",
    "category": "string (required) - Kategori",
    "targetAudience": "string (required) - Hedef kitle",
    "followerRange": "string (required) - Takipçi aralığı",
    "platformPreference": "string (required) - Platform tercihi",
    "businessType": "string (required) - İş tipi",
    "contentType": "string (required) - İçerik türü",
    "imageUrl": "string (optional) - Hediye kiti görseli URL'i",
    "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
    "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)",
    "status": "string (optional) - Hediye kiti durumu (örn: 'active', 'inactive', 'pending')"
  },
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Hediye kiti bulunamadı')"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi hediye kitlerine erişim yetkisi olmalı
- Tüm POST'taki alanlar + ek alanlar (id, createDate, updateDate, status) dönmeli
- `createDate` zorunludur ve ISO 8601 formatında olmalı
- `updateDate` opsiyoneldir, güncelleme yapılmadıysa null olabilir
- `status` opsiyoneldir, hediye kitinin aktif/pasif durumunu gösterir

**Örnek Response:**
```json
{
  "success": true,
  "data": {
    "id": "789",
    "title": "Yaz Koleksiyonu Hediye Kiti",
    "content": "Yaz sezonu için özel hazırlanmış hediye kiti. İçerisinde güneş kremi, şapka, plaj havlusu ve daha fazlası bulunmaktadır.",
    "category": "fashion",
    "targetAudience": "adults",
    "followerRange": "10k-50k",
    "platformPreference": "instagram",
    "businessType": "project-based",
    "contentType": "photo",
    "imageUrl": "https://example.com/images/gift-kit-789.jpg",
    "createDate": "2025-01-20T10:00:00.000Z",
    "updateDate": "2025-01-22T14:30:00.000Z",
    "status": "active"
  },
  "message": null
}
```

---

### 4. Get Gift Kits List (Hediye Kiti Listesi)

**Endpoint:** `GET Advertisements/addGiftKit`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Query Parameters (Opsiyonel):**
- `page`: number - Sayfa numarası (varsayılan: 1)
- `pageSize`: number - Sayfa başına kayıt sayısı (varsayılan: tümü)
- `searchTerm`: string - Arama terimi (başlık, içerik, kategori vb. alanlarda arama yapar)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Hediye kiti ID'si",
      "title": "string (required) - Hediye kiti başlığı",
      "content": "string (required) - Hediye kiti içerik bilgisi",
      "category": "string (required) - Kategori",
      "targetAudience": "string (required) - Hedef kitle",
      "followerRange": "string (required) - Takipçi aralığı",
      "platformPreference": "string (required) - Platform tercihi",
      "businessType": "string (required) - İş tipi",
      "contentType": "string (required) - İçerik türü",
      "imageUrl": "string (optional) - Hediye kiti görseli URL'i",
      "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
      "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)",
      "status": "string (optional) - Hediye kiti durumu"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi hediye kitlerinin listesi dönmeli
- Hediye kitleri en yeni tarihli olandan en eskiye doğru sıralanmalı
- Boş liste durumunda boş array dönmeli
- Her hediye kiti için tüm alanlar (POST'taki alanlar + id, createDate, updateDate, status) dönmeli
- **Pagination:**
  - `page` parametresi gönderilirse, belirtilen sayfa döner
  - `pageSize` parametresi gönderilirse, sayfa başına belirtilen sayıda kayıt döner
  - Her iki parametre de gönderilirse, pagination uygulanır
  - Örnek: `GET Advertisements/addGiftKit?page=1&pageSize=10` → İlk sayfadan 10 kayıt döner
- **Search:**
  - `searchTerm` parametresi gönderilirse, başlık, içerik, kategori gibi alanlarda arama yapılır
  - Arama case-insensitive (büyük/küçük harf duyarsız) olmalı
  - Boş string gönderilirse arama yapılmaz
  - Örnek: `GET Advertisements/addGiftKit?searchTerm=yaz` → "yaz" içeren hediye kitleri döner
- **Kullanım:**
  - Bu endpoint ad-management sayfasında "Hediye Kitleri" tab'ında kullanılır
  - Dönen veriler takvim görünümünde gösterilir
  - Not: GiftKit'lerde `startDate` ve `endDate` olmadığı için, `createDate` kullanılarak takvim görünümü oluşturulur

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "789",
      "title": "Yaz Koleksiyonu Hediye Kiti",
      "content": "Yaz sezonu için özel hazırlanmış hediye kiti...",
      "category": "fashion",
      "targetAudience": "adults",
      "followerRange": "10k-50k",
      "platformPreference": "instagram",
      "businessType": "project-based",
      "contentType": "photo",
      "imageUrl": "https://example.com/images/gift-kit-789.jpg",
      "createDate": "2025-01-20T10:00:00.000Z",
      "updateDate": null,
      "status": "active"
    },
    {
      "id": "790",
      "title": "Kış Koleksiyonu Hediye Kiti",
      "content": "Kış sezonu için özel hazırlanmış hediye kiti...",
      "category": "fashion",
      "targetAudience": "everyone",
      "followerRange": "50k-100k",
      "platformPreference": "tiktok",
      "businessType": "full-time",
      "contentType": "video",
      "imageUrl": "https://example.com/images/gift-kit-790.jpg",
      "createDate": "2025-01-18T08:00:00.000Z",
      "updateDate": "2025-01-19T12:00:00.000Z",
      "status": "active"
    }
  ],
  "message": null
}
```

---

## Global Header Requirements

### Authorization Header
Tüm authenticated endpoint'lerde:
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>
```

---

## Response Format Standartları

### Başarılı Response Formatı
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "string (optional)"
}
```

### Liste Response Formatı
```json
{
  "success": true,
  "data": [ /* array */ ],
  "message": null
}
```

### Hata Response Formatı
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

---

## HTTP Status Codes

- **200 OK**: İşlem başarılı
- **400 Bad Request**: Geçersiz request (validation hatası, vb.)
- **401 Unauthorized**: Token geçersiz veya eksik
- **403 Forbidden**: Yetki yetersiz
- **404 Not Found**: Kaynak bulunamadı
- **500 Internal Server Error**: Sunucu hatası

---

## Notlar

- Token süresi: 60 dakika (ayarlanabilir)
- Token format: JWT
- Authorization header: `Bearer` prefix'i opsiyonel
- Tüm tarih alanları ISO 8601 formatında olmalı
- Email validasyonu yapılmalı
- Password minimum 6 karakter olmalı

---

## Company Request & Support Endpoints

### Request Status Enum

Talep durumu için kullanılan enum değerleri:

```typescript
enum RequestStatus {
  PENDING = "beklemede",      // Beklemede
  IN_PROGRESS = "işlemde",    // İşlemde
  RESOLVED = "çözüldü",       // Çözüldü
  CANCELLED = "iptal",        // İptal
}
```

**Değerler:**
- `"beklemede"` - Beklemede
- `"işlemde"` - İşlemde
- `"çözüldü"` - Çözüldü
- `"iptal"` - İptal

---

### Support Status Enum

Destek durumu için kullanılan enum değerleri:

```typescript
enum SupportStatus {
  PENDING = "beklemede",      // Beklemede
  IN_PROGRESS = "işlemde",    // İşlemde
  ANSWERED = "cevaplandı",    // Cevaplandı
  RESOLVED = "çözüldü",       // Çözüldü
  CANCELLED = "iptal",        // İptal
}
```

**Değerler:**
- `"beklemede"` - Beklemede
- `"işlemde"` - İşlemde
- `"cevaplandı"` - Cevaplandı
- `"çözüldü"` - Çözüldü
- `"iptal"` - İptal

---

### 1. Create Request (Talep Oluşturma)

**Endpoint:** `POST company/request`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required) - Talep başlığı (minimum 3 karakter)",
  "type": "string (required) - Talep türü (örn: 'Reklam Talebi', 'Teknik Destek', 'Genel Talep', 'Ödeme Sorunu')",
  "description": "string (required) - Talep açıklaması (minimum 10 karakter)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Talep başarıyla oluşturuldu)",
  "data": {
    "id": "string - Oluşturulan talebin ID'si",
    "title": "string - Talep başlığı",
    "type": "string - Talep türü"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Eksik alan', 'Geçersiz veri', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi taleplerini oluşturma yetkisi olmalı
- `title` minimum 3 karakter olmalıdır
- `description` minimum 10 karakter olmalıdır
- `type` değeri önceden tanımlı değerlerden biri olmalıdır
- Oluşturulan talep varsayılan olarak "beklemede" durumunda olmalıdır

**Örnek Request:**
```json
POST company/request
{
  "title": "Reklam vermek istiyorum",
  "type": "Reklam Talebi",
  "description": "Öne çıkabilmek için firmamın reklamını vermek istiyorum."
}
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Talep başarıyla oluşturuldu",
  "data": {
    "id": "req-123",
    "title": "Reklam vermek istiyorum",
    "type": "Reklam Talebi"
  }
}
```

---

### 2. Get Requests List (Talep Listesi)

**Endpoint:** `GET company/request`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Query Parameters (Opsiyonel):**
- `page`: number - Sayfa numarası (varsayılan: 1)
- `pageSize`: number - Sayfa başına kayıt sayısı (varsayılan: tümü)
- `searchTerm`: string - Arama terimi (başlık, açıklama, tür vb. alanlarda arama yapar)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Talep ID'si",
      "title": "string (required) - Talep başlığı",
      "type": "string (required) - Talep türü",
      "description": "string (required) - Talep açıklaması",
      "status": "string (required) - Talep durumu ('beklemede', 'işlemde', 'çözüldü', 'iptal')",
      "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
      "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi taleplerinin listesi dönmeli
- Talepler en yeni tarihli olandan en eskiye doğru sıralanmalı
- Boş liste durumunda boş array dönmeli
- `status` alanı RequestStatus enum değerlerinden biri olmalıdır
- **Pagination:**
  - `page` parametresi gönderilirse, belirtilen sayfa döner
  - `pageSize` parametresi gönderilirse, sayfa başına belirtilen sayıda kayıt döner
  - Her iki parametre de gönderilirse, pagination uygulanır
  - Örnek: `GET company/request?page=1&pageSize=10` → İlk sayfadan 10 kayıt döner
- **Search:**
  - `searchTerm` parametresi gönderilirse, başlık, açıklama, tür gibi alanlarda arama yapılır
  - Arama case-insensitive (büyük/küçük harf duyarsız) olmalı
  - Boş string gönderilirse arama yapılmaz
  - Örnek: `GET company/request?searchTerm=reklam` → "reklam" içeren talepler döner

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "req-123",
      "title": "Reklam vermek istiyorum",
      "type": "Reklam Talebi",
      "description": "Öne çıkabilmek için firmamın reklamını vermek istiyorum.",
      "status": "çözüldü",
      "createDate": "2025-01-15T10:30:00.000Z",
      "updateDate": "2025-01-16T14:20:00.000Z"
    },
    {
      "id": "req-124",
      "title": "Teknik Destek Talebi",
      "type": "Teknik Destek",
      "description": "Sistemde bir sorun yaşıyorum, yardıma ihtiyacım var.",
      "status": "beklemede",
      "createDate": "2025-01-20T09:15:00.000Z",
      "updateDate": null
    }
  ],
  "message": null
}
```

---

### 3. Create Support (Destek Oluşturma)

**Endpoint:** `POST company/support`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required) - Destek başlığı (minimum 3 karakter)",
  "type": "string (required) - Destek türü (örn: 'Teknik Destek', 'Hesap Sorunu', 'Özellik İsteği', 'Geri Bildirim')",
  "description": "string (required) - Destek açıklaması (minimum 10 karakter)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "string (Destek başarıyla oluşturuldu)",
  "data": {
    "id": "string - Oluşturulan desteğin ID'si",
    "title": "string - Destek başlığı",
    "type": "string - Destek türü"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Eksik alan', 'Geçersiz veri', vb.)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi desteklerini oluşturma yetkisi olmalı
- `title` minimum 3 karakter olmalıdır
- `description` minimum 10 karakter olmalıdır
- `type` değeri önceden tanımlı değerlerden biri olmalıdır
- Oluşturulan destek varsayılan olarak "beklemede" durumunda olmalıdır

**Örnek Request:**
```json
POST company/support
{
  "title": "Hesap Ayarları Sorunu",
  "type": "Hesap Sorunu",
  "description": "Hesap ayarlarımda bir sorun var, düzeltilmesini istiyorum."
}
```

**Örnek Response:**
```json
{
  "success": true,
  "message": "Destek başarıyla oluşturuldu",
  "data": {
    "id": "sup-456",
    "title": "Hesap Ayarları Sorunu",
    "type": "Hesap Sorunu"
  }
}
```

---

### 4. Get Supports List (Destek Listesi)

**Endpoint:** `GET company/support`

**Headers:**
```
Authorization: Bearer <token>
```
veya
```
Authorization: <token>  (Bearer prefix'i opsiyonel)
```

**Query Parameters (Opsiyonel):**
- `page`: number - Sayfa numarası (varsayılan: 1)
- `pageSize`: number - Sayfa başına kayıt sayısı (varsayılan: tümü)
- `searchTerm`: string - Arama terimi (başlık, açıklama, tür vb. alanlarda arama yapar)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string (required) - Destek ID'si",
      "title": "string (required) - Destek başlığı",
      "type": "string (required) - Destek türü",
      "description": "string (required) - Destek açıklaması",
      "status": "string (required) - Destek durumu ('beklemede', 'işlemde', 'cevaplandı', 'çözüldü', 'iptal')",
      "createDate": "string (required) - Oluşturulma tarihi (ISO 8601 format)",
      "updateDate": "string (optional) - Güncellenme tarihi (ISO 8601 format)"
    }
  ],
  "message": "string (optional)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "string (Hata mesajı: 'Token geçersiz', 'Yetkisiz erişim', vb.)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "string (Hata mesajı)"
}
```

**Notlar:**
- Token doğrulanmalı
- Kullanıcının kendi desteklerinin listesi dönmeli
- Destekler en yeni tarihli olandan en eskiye doğru sıralanmalı
- Boş liste durumunda boş array dönmeli
- `status` alanı SupportStatus enum değerlerinden biri olmalıdır
- **Pagination:**
  - `page` parametresi gönderilirse, belirtilen sayfa döner
  - `pageSize` parametresi gönderilirse, sayfa başına belirtilen sayıda kayıt döner
  - Her iki parametre de gönderilirse, pagination uygulanır
  - Örnek: `GET company/support?page=1&pageSize=10` → İlk sayfadan 10 kayıt döner
- **Search:**
  - `searchTerm` parametresi gönderilirse, başlık, açıklama, tür gibi alanlarda arama yapılır
  - Arama case-insensitive (büyük/küçük harf duyarsız) olmalı
  - Boş string gönderilirse arama yapılmaz
  - Örnek: `GET company/support?searchTerm=hesap` → "hesap" içeren destekler döner

**Örnek Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sup-456",
      "title": "Hesap Ayarları Sorunu",
      "type": "Hesap Sorunu",
      "description": "Hesap ayarlarımda bir sorun var, düzeltilmesini istiyorum.",
      "status": "cevaplandı",
      "createDate": "2025-01-18T11:20:00.000Z",
      "updateDate": "2025-01-19T09:30:00.000Z"
    },
    {
      "id": "sup-457",
      "title": "Yeni Özellik İsteği",
      "type": "Özellik İsteği",
      "description": "Uygulamaya yeni bir özellik eklenmesini istiyorum.",
      "status": "beklemede",
      "createDate": "2025-01-20T14:45:00.000Z",
      "updateDate": null
    }
  ],
  "message": null
}
```

---

## Son Güncelleme

- **Tarih:** 2025-01-XX
- **Versiyon:** 1.0.15
- **Son Eklenen:** Company Request & Support endpoints (Create, Get)

