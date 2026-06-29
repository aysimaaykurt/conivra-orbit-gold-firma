# Backend Geliştirici İçin Yeni Endpoint ve Düzenleme Talepleri

Bu doküman, frontend (arayüz) entegrasyonu sırasında tespit edilen eksik endpoint'leri, veri yapılarındaki genişletme taleplerini ve yeni özellikleri içermektedir. Tüm değişiklikler mevcut swagger dokümantasyonuna (`API_DOCUMENTATION.md`) ek olarak talep edilmektedir.

## 1. Dashboard (Panel) İhtiyaçları

### 1.1. Bekleyen Değerlendirmeler (Pending Reviews)
- **Talep**: Dashboard üzerindeki "Bekleyen Değerlendirmeler" listesini beslemek için `GET /api/v1/company/dashboard/pending-review` endpointine ihtiyaç vardır.

## 2. İlan, Workshop ve Hediye Kiti Yönetimi

### 2.1. İlan ve Workshop Kategori Filtrelemesi
- **Kategori Listesi**: Kategori seçimi için dinamik liste dönen `GET /api/v1/Categories/list` endpointine ihtiyaç vardır.
- **Filtreleme**: İlan (Advertisement) ve Workshop listeleme `GET` endpoint'lerine, filtreleme yapılabilmesi için `category` query parametresi eklenmelidir.

### 2.2. İlanlar İçin Silme İşlemi
- **Talep**: Yanlış açılan veya iptal edilmek istenen ilan/workshopların silinebilmesi için `DELETE /api/v1/Advertisements/{id}` ve `DELETE /api/v1/Workshops/{id}` endpointlerinin eklenmesi.

### 2.3. Birden Fazla İçerik Formatı Seçimi
- **Talep**: İlan oluşturma isteği (`POST /api/v1/Advertisements`) atılırken "İçerik Formatı" için sadece tekil (örn. "Reels") değil, çoklu seçim yapılabilmesi gerekmektedir. Payload içerisindeki alan `string[]` (dizi) olarak güncellenmelidir (örn: `["Reels", "Story"]`).

### 2.4. Hediye Kiti Geçerlilik Süresi
- **Talep**: Hediye Kiti (Gift Kit) oluştururken geçerlilik süresinin (örn: son kullanma tarihi) kaydedilebilmesi için ilgili modele `expirationDate` veya `validityPeriod` parametresi eklenmelidir.

### 2.5. İlan/Workshop/Hediye Kiti Görsellerini Silme (Image Deletion)
- **Talep**: Mevcut bir ilan güncellenirken (Update), arayüzden silinen eski fotoğrafların sunucudan da silinebilmesi için bir mekanizmaya ihtiyaç vardır. Bunun için ya `PUT` payload'ına `deletedImageIds` dizisi (array) eklenmeli ya da bağımsız bir `DELETE /api/v1/Advertisements/deleteImage/{imageId}` endpoint'i oluşturulmalıdır. Şu anki yapıda sadece yeni fotoğraflar eskilere eklenmektedir.

## 3. Başvurularım ve Projelerim (Kritik Ortak Yapı)

**Durum**: 
1. Başvurularım sayfasındaki üst tabları (ilanları) dinamik olarak çizebilmemiz için aktif ilanların sadece özet bilgilerine ihtiyacımız var.
2. "Projelerim / Kampanyalarım" sayfası için arayüzde hiçbir endpoint bulunmuyor.

**Çözüm**: Aktif ilan özetlerini ve projeleri (tamamlanmış ilanlar) tek bir endpoint üzerinden, filtrelerle çekmek en sağlıklı yöntem olacaktır.

### Önerilen Endpoint: `GET /api/v1/Advertisements/projects-list`

**Query Parametreleri:**
- `status` (String) - `active` (Başvurularım tabları için) veya `completed` (Projelerim sayfası için) 
- `type` (String) - İlan tipi kısıtı istenirse (opsiyonel)

**Örnek JSON Yanıtı (Paginated Wrapper Formatına Uygun):**
```json
{
  "success": true,
  "message": "Projeler başarıyla getirildi",
  "data": {
    "items": [
      {
        "id": "adv-123",
        "title": "Soiree Menü Reklamı",
        "type": "barter",
        "status": "active",
        "applicationCount": 15,
        "createDate": "2026-06-01T10:00:00Z"
      },
      {
        "id": "adv-124",
        "title": "Yaz Sezonu Kapanış Partisi",
        "type": "barter",
        "status": "completed",
        "applicationCount": 42,
        "createDate": "2025-09-01T09:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

## 4. Genel Formlar ve Ayarlar (Statik Verilerin Dinamikleşmesi)

### 4.1. İl, İlçe ve Sektör Listelerinin Dinamikleştirilmesi
Arayüzde şu an sabit dosyalardan okunan form elemanlarının veritabanı kontrollü olması için listeleme endpointleri:
- **İl ve İlçeler**: `GET /api/v1/Locations/cities` (Tercihen şehre tıklandığında ilçeleri dönen hiyerarşik veya parametreli bir yapı)
- **Sektörler**: `GET /api/v1/company/sectors`

### 4.2. Talep ve Destek Yönetimi Güncellemeleri
- **Talep**: Oluşturulmuş bir şirket destek kaydının (company/support) iptal edilebilmesi veya düzeltilebilmesi için:
  - Silme: `DELETE /api/v1/company/support/{id}` 
  - Düzenleme: `PUT /api/v1/company/support/{id}`
endpoint'lerine ihtiyaç vardır.

## 5. Mobil Harita Entegrasyonu Gereksinimleri (Canlı Harita)

Mobil uygulamada ilanların ve workshopların harita üzerinde pin (marker) olarak gösterilmesi için gerekli olan veri modelleri ve yeni endpoint yapıları aşağıda belirtilmiştir.

### 5.1. Haritada Gösterim İçin Eksik / Gerekli Alanlar (DB & DTO)
Mevcut `Advertisements` ve `Workshops` tablolarına ve bunların Response DTO'larına (`GET` isteklerine) aşağıdaki alanlar eklenmeli ve dolu döndürülmelidir:
*   `latitude` (double/decimal): Konumun enlemi. (Örn: `37.6910896`)
*   `longitude` (double/decimal): Konumun boylamı. (Örn: `28.9784123`)
*   `address` (string): Seçilen tam açık adres bilgisi.

### 5.2. Harita İçin Optimize Edilmiş Ortak Liste Endpoint'i
Mobil uygulamanın harita ekranına yüklenme hızını artırmak ve gereksiz veri transferini engellemek için, ilanları ve workshopları **aynı anda** ve sadece harita için gerekli olan minimal alanlarla döndüren yeni bir endpoint'e ihtiyaç vardır:

*   **Endpoint:** `GET /api/v1/Map/markers`
*   **Query Parametreleri (Filtreler):**
    *   `latitude` (double, opsiyonel): Kullanıcının o anki enlemi.
    *   `longitude` (double, opsiyonel): Kullanıcının o anki boylamı.
    *   `radiusInKm` (double, opsiyonel, varsayılan: `20`): Tarama yarıçapı.
    *   `minLat` / `maxLat` / `minLng` / `maxLng` (double, opsiyonel): Haritada o an görüntülenen kutu sınırları (Viewport Bounding Box).
    *   `type` (string, opsiyonel): `advertisement` veya `workshop` filtresi.
    *   `category` (string, opsiyonel): Kategori filtresi.

*   **Örnek JSON Yanıtı (Response Body):**
    ```json
    {
      "success": true,
      "message": "Harita konum işaretçileri başarıyla getirildi",
      "data": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "title": "Kahve Atölyesi ve Workshop",
          "type": "workshop",
          "category": "Eğitim",
          "latitude": 37.6910896,
          "longitude": 28.9784123,
          "address": "Atatürk Mh. İstiklal Cd. No:45 Kadıköy/İstanbul",
          "companyName": "Soiree Cafe",
          "mainImageUrl": "https://api.domain.com/uploads/workshops/image1.jpg"
        },
        {
          "id": "8ca75d31-4113-4a11-a3fb-1c913c22bfa2",
          "title": "Ürün Tanıtım Reklam Kampanyası",
          "type": "advertisement",
          "category": "Tanıtım",
          "latitude": 41.0082,
          "longitude": 28.9784,
          "address": "Cumhuriyet Cd. No:12 Beşiktaş/İstanbul",
          "companyName": "Gold Tasarım A.Ş.",
          "mainImageUrl": "https://api.domain.com/uploads/ads/image2.jpg"
        }
      ]
    }
    ```

